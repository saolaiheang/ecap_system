import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/config";
import { Competition } from "@/entities";
import { TypeOfSport } from "@/entities/";

export const createCompetion = async (name: string, location: string, start_date: Date, sport_id: string) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const sportTypeRepository = AppDataSource.getRepository(TypeOfSport);
        const competitionRepository = AppDataSource.getRepository(Competition);
        const newCompetition = new Competition();
        const sportType = await sportTypeRepository.findOneBy({ id: sport_id });
        if (!sportType) {
            return { message: "Sport Type not found", status: 404 };
        }
        newCompetition.name = name;
        newCompetition.lacation = location;
        newCompetition.start_date = start_date;
        newCompetition.typeOfSport = sportType;
        await competitionRepository.save(newCompetition);
        return { message: "Competition created successfully", status: 201 }
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Error creating competition" }, { status: 500 })
    }
}


export const getCompetitionBytypeOfsport = async (sport_id: string) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const competitionRepository = AppDataSource.getRepository(Competition);
        const sportTypeRepository = AppDataSource.getRepository(TypeOfSport);

        const sportType = await sportTypeRepository.findOneBy({ id: sport_id });

        if (!sportType) {
            return { message: "Sport Type not found", status: 404 };
        }

        const competitions = await competitionRepository.find({
            where: { typeOfSport: sportType },
            relations: ["typeOfSport"],
        });

        return { data: competitions, status: 200 };
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export const updateCompetition = async (
    id: string,
    name: string,
    location: string,
    start_date: Date,
    sport_id: string
) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const competitionRepository = AppDataSource.getRepository(Competition);
        const sportTypeRepository = AppDataSource.getRepository(TypeOfSport);

        const competition = await competitionRepository.findOneBy({ id });

        if (!competition) {
            return { message: "Competition not found", status: 404 };
        }

        const sportType = await sportTypeRepository.findOneBy({ id: sport_id });

        if (!sportType) {
            return { message: "Sport Type not found", status: 404 };
        }

        competition.name = name;
        competition.lacation = location;
        competition.start_date = start_date;
        competition.typeOfSport = sportType;

        await competitionRepository.save(competition);

        return { message: "Competition updated successfully", status: 200 };
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};

export const deleteCompetition = async (id: string) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const competitionRepository = AppDataSource.getRepository(Competition);

        const competition = await competitionRepository.findOneBy({ id });

        if (!competition) {
            return { message: "Competition not found", status: 404 };
        }

        await competitionRepository.remove(competition);

        return { message: "Competition deleted successfully", status: 200 };
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};