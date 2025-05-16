
import { NextRequest, NextResponse } from "next/server";
import { SportType } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource"; 
import { AppDataSource } from "@/config";

export const createTypeOfSport = async (req: NextRequest) => {
    try {
        // await initializeDataSource();
        (async () => {
            await initializeDataSource();
            console.log("App is running...");
        })();
        const { name, description,image } = await req.json();

        if (!name || !description) {
            return NextResponse.json(
                { error: "Name and description are required" },
                { status: 400 }
            );
        }

        const typeOfSport = AppDataSource.getRepository(SportType).create({
            name,
            description,
            image
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

export const getTypeOfSport = async (req: NextRequest) => {
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
        const { name, description } = await req.json();

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