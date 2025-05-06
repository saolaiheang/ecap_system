import { NextRequest, NextResponse } from "next/server";
import { TypeOfSport } from "@/entities";
import { AppDataSource } from "@/config";

export const createTypeOfSport = async (req: NextRequest) => {
    try {
        const { name, description } = await req.json();
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const typeOfSport = AppDataSource.getRepository(TypeOfSport).create({
            name,
            description
        });
        if (!name || !description) {
            return NextResponse.json({ error: 'Name and description are required' },
                { status: 400 }
            )
        }
        
        await AppDataSource.manager.save(typeOfSport);
        return NextResponse.json({ message: 'Type of sport created successfully' },
            { status: 201 }
        )

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error creating type of sport' },
            { status: 500 }
        )

    }
}

export const getTypeOfSport = async (req: NextRequest) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const typeOfSport = await AppDataSource.getRepository(TypeOfSport).find();
        return NextResponse.json({ typeOfSport },
            { status: 200 }
        )
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error getting type of sport' },
            { status: 500 }
        )
    }
}
export const getTypeOfSportById = async (req: NextRequest,context:{params:{id:string}}) =>
    {
        try {
            const { id } = context.params;
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
            const typeOfSport = await AppDataSource.getRepository(TypeOfSport).findOneBy({id});
            return NextResponse.json({ typeOfSport },
                { status: 200 }
            )
        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: 'Error getting type of sport' },
                { status: 500 }
            )
        }
    }
export const updateTypeOfSport = async (req: NextRequest, context:{params:{id:string}}) => {
    try {
        const { id } = context.params;
        const { name, description } = await req.json();
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const typeOfSport = await AppDataSource.getRepository(TypeOfSport).findOneBy({id});
        if (!typeOfSport) {
            return NextResponse.json({ error: 'Type of sport not found' },
                { status: 404 }
            )
        }
        typeOfSport.name = name;
        typeOfSport.description = description;
        await AppDataSource.manager.save(typeOfSport);
        return NextResponse.json({ message: 'Type of sport updated successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error updating type of sport' },
            { status: 500 }
        )
    }
}
export const deleteTypeOfSport = async (req: NextRequest, context:{params:{id:string}}) => {
    try {
        const { id } = context.params;
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const typeOfSport = await AppDataSource.getRepository(TypeOfSport).findOneBy({id});
        if (!typeOfSport) {
            return NextResponse.json({ error: 'Type of sport not found' },
                { status: 404 }
            )
        }
        await AppDataSource.manager.remove(typeOfSport);
        return NextResponse.json({ message: 'Type of sport deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error deleting type of sport' },
            { status: 500 }
        )
    }
}