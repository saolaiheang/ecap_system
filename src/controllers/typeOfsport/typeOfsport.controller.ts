
import { NextRequest, NextResponse } from "next/server";
import { SportType } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource"; 
import { AppDataSource } from "@/config";
import cloudinary from "@/lib/cloudinary";
import os from 'os';
import fs,{writeFile} from "fs/promises"
export const createTypeOfSport = async (req: NextRequest) => {
    try {
        await initializeDataSource();
        
        // const { name, description,image } = await req.json();
        const formData= await req.formData();
        const name =formData.get("name") as string;
        const description=formData.get("description") as string;
        const image = formData.get("image") as File;

        if (!name || !description) {
            return NextResponse.json(
                { error: "Name and description are required" },
                { status: 400 }
            );
        }
        if(!image){
            return NextResponse.json(
                {error:"Image file is required"},
                {status:400}
            )
        }
        if(!image.type.startsWith("image/")){
            return NextResponse.json(
                {error:"Only image file are allowed"},
                {status:400}
            )
        }

        const tempFilePath=`${os.tmpdir()}/${image.name}-${Date.now()}`;
        const fileBuffer=Buffer.from(await image.arrayBuffer());
        await writeFile(tempFilePath,fileBuffer);
        const uploadResult= await cloudinary.uploader.upload(tempFilePath,{
            folder:"typeOfsport",
            public_id:`${name}-${Date.now()}`
        })
        await fs.unlink(tempFilePath);

        const typeOfSport = AppDataSource.getRepository(SportType).create({
            name,
            description,
            image:uploadResult.secure_url
        });

        await AppDataSource.manager.save(typeOfSport);
        return NextResponse.json(
            { message: "Type of sport created successfully", data: typeOfSport },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating type of sport:", error);
        return NextResponse.json(
            { error: "Error creating type of sport" },
            { status: 500 }
        );
    }
};

export const getTypeOfSport = async (_req: NextRequest) => {
    try {
        await initializeDataSource();
        const typeOfSport = await AppDataSource.getRepository(SportType).find();
        return NextResponse.json(
            { typeOfSport },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting type of sport:", error);
        return NextResponse.json(
            { error: "Error getting type of sport" },
            { status: 500 }
        );
    }
};

export const getTypeOfSportById = async (
    _req: NextRequest,
    context: { params: { id: string } }
) => {
    try {
        await initializeDataSource();
        const { id } = context.params;
        const typeOfSport = await AppDataSource.getRepository(SportType).findOneBy({
            id,
        });
        if (!typeOfSport) {
            return NextResponse.json(
                { error: "Type of sport not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { typeOfSport },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting type of sport by ID:", error);
        return NextResponse.json(
            { error: "Error getting type of sport" },
            { status: 500 }
        );
    }
};

export const updateTypeOfSport = async (
    req: NextRequest,
    context: { params: { id: string } }
) => {
    try {
        await initializeDataSource();
        const { id } = context.params;

        const formData= await req.formData();
        const name =formData.get("name") as string;
        const description=formData.get("description") as string;
        const image = formData.get("image") as File;


        if (!name || !description) {
            return NextResponse.json(
                { error: "Name and description are required" },
                { status: 400 }
            );
        }
        if(!image){
            return NextResponse.json(
                {error:"Image file is required"},
                {status:400}
            )
        }
        if(!image.type.startsWith("image/")){
            return NextResponse.json(
                {error:"Only image file are allowed"},
                {status:400}
            )
        }

        const tempFilePath=`${os.tmpdir()}/${image.name}-${Date.now()}`;
        const fileBuffer=Buffer.from(await image.arrayBuffer());
        await writeFile(tempFilePath,fileBuffer);
        const uploadResult= await cloudinary.uploader.upload(tempFilePath,{
            folder:"typeOfsport",
            public_id:`${name}-${Date.now()}`
        })
        await fs.unlink(tempFilePath);

        const typeOfSport = await AppDataSource.getRepository(SportType).findOneBy({
            id,
        });
        if (!typeOfSport) {
            return NextResponse.json(
                { error: "Type of sport not found" },
                { status: 404 }
            );
        }

        typeOfSport.name = name || typeOfSport.name;
        typeOfSport.description = description || typeOfSport.description;
        typeOfSport.image=uploadResult.secure_url

        await AppDataSource.manager.save(typeOfSport);
        return NextResponse.json(
            { message: "Type of sport updated successfully", data: typeOfSport },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating type of sport:", error);
        return NextResponse.json(
            { error: "Error updating type of sport" },
            { status: 500 }
        );
    }
};

export const deleteTypeOfSport = async (
    req: NextRequest,
    context: { params: { id: string } }
) => {
    try {
        await initializeDataSource();
        const { id } = context.params;
        const typeOfSport = await AppDataSource.getRepository(SportType).findOneBy({
            id,
        });
        if (!typeOfSport) {
            return NextResponse.json(
                { error: "Type of sport not found" },
                { status: 404 }
            );
        }

        await AppDataSource.manager.remove(typeOfSport);
        return NextResponse.json(
            { message: "Type of sport deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting type of sport:", error);
        return NextResponse.json(
            { error: "Error deleting type of sport" },
            { status: 500 }
        );
    }
};