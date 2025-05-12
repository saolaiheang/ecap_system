// import { NextRequest, NextResponse } from "next/server";
// import { AppDataSource } from "@/config";
// import { Competition } from "@/entities";
// import { SportType } from "@/entities";

// export const createCompetion = async (name: string, location: string, start_date: Date, sport_id: string) => {
//     try {
//         if (!AppDataSource.isInitialized) {
//             await AppDataSource.initialize();
//         }
//         const sportTypeRepository = AppDataSource.getRepository(TypeOfSport);
//         const competitionRepository = AppDataSource.getRepository(Competition);
//         const newCompetition = new Competition();
//         const sportType = await sportTypeRepository.findOneBy({ id: sport_id });
//         if (!sportType) {
//             return { message: "Sport Type not found", status: 404 };
//         }
//         newCompetition.name = name;
//         newCompetition.location = location;
//         newCompetition.start_date = start_date;
//         newCompetition.sportType = sportType;
//         await competitionRepository.save(newCompetition);
//         return { message: "Competition created successfully", status: 201 }
//     } catch (err) {
//         console.log(err)
//         return NextResponse.json({ message: "Error creating competition" }, { status: 500 })
//     }
// }


// export const getCompetitionBytypeOfsport = async (sport_id: string) => {
//     try {
//         if (!AppDataSource.isInitialized) {
//             await AppDataSource.initialize();
//         }

//         const competitionRepository = AppDataSource.getRepository(Competition);
//         const sportTypeRepository = AppDataSource.getRepository(SportType);

//         const sportType = await sportTypeRepository.findOneBy({ id: sport_id });

//         if (!sportType) {
//             return { message: "Sport Type not found", status: 404 };
//         }

//         const competitions = await competitionRepository.find({
//             where: { SportType: sportType },
//             relations: ["typeOfSport"],
//         });

//         return { data: competitions, status: 200 };
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }

// export const updateCompetition = async (
//     id: string,
//     name: string,
//     location: string,
//     start_date: Date,
//     sport_id: string
// ) => {
//     try {
//         if (!AppDataSource.isInitialized) {
//             await AppDataSource.initialize();
//         }

//         const competitionRepository = AppDataSource.getRepository(Competition);
//         const sportTypeRepository = AppDataSource.getRepository(TypeOfSport);

//         const competition = await competitionRepository.findOneBy({ id });

//         if (!competition) {
//             return { message: "Competition not found", status: 404 };
//         }

//         const sportType = await sportTypeRepository.findOneBy({ id: sport_id });

//         if (!sportType) {
//             return { message: "Sport Type not found", status: 404 };
//         }

//         competition.name = name;
//         competition.lacation = location;
//         competition.start_date = start_date;
//         competition.typeOfSport = sportType;

//         await competitionRepository.save(competition);

//         return { message: "Competition updated successfully", status: 200 };
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// };

// export const deleteCompetition = async (id: string) => {
//     try {
//         if (!AppDataSource.isInitialized) {
//             await AppDataSource.initialize();
//         }

//         const competitionRepository = AppDataSource.getRepository(Competition);

//         const competition = await competitionRepository.findOneBy({ id });

//         if (!competition) {
//             return { message: "Competition not found", status: 404 };
//         }

//         await competitionRepository.remove(competition);

//         return { message: "Competition deleted successfully", status: 200 };
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// };



import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/config";
import { Competition, SportType } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";

// Interface for request body typing
interface CompetitionInput {
    name: string;
    location: string;
    start_date: Date;
    sport_type_id: string;
}

export const createCompetition = async (req: NextRequest) => {
    try {
        await initializeDataSource();

        const { name, location, start_date, sport_type_id } = await req.json() as CompetitionInput;

        // Validate required fields
        if (!name || !location || !start_date || !sport_type_id) {
            return NextResponse.json(
                { error: "Name, location, start_date, and sport_type_id are required" },
                { status: 400 }
            );
        }

        // Validate SportType exists
        const sportTypeRepository = AppDataSource.getRepository(SportType);
        const sportType = await sportTypeRepository.findOne({ where: { id: sport_type_id } });
        if (!sportType) {
            return NextResponse.json(
                { error: "Sport type not found" },
                { status: 404 }
            );
        }

        // Create and save Competition
        const competitionRepository = AppDataSource.getRepository(Competition);
        const competition = competitionRepository.create({
            name,
            location,
            start_date,
            sport_type_id,
        });

        await competitionRepository.save(competition);

        return NextResponse.json(
            { message: "Competition created successfully", data: competition },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating competition:", error);
        return NextResponse.json(
            { error: "Error creating competition" },
            { status: 500 }
        );
    }
};

export const getCompetitionByTypeOfSport = async (req: NextRequest, context: { params: { sport_id: string } }) => {
    try {
        await initializeDataSource();

        const { sport_id } = context.params;
        const competitionRepository = AppDataSource.getRepository(Competition);

        const competitions = await competitionRepository.find({
            where: { sport_type_id: sport_id },
            relations: ["sportType"],
        });

        if (competitions.length === 0) {
            return NextResponse.json(
                { message: "No competitions found for this sport type" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: competitions },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting competitions by sport type:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export const updateCompetition = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        await initializeDataSource();

        const { id } = context.params;
        const { name, location, start_date, sport_type_id } = await req.json() as CompetitionInput;

        const competitionRepository = AppDataSource.getRepository(Competition);
        const sportTypeRepository = AppDataSource.getRepository(SportType);

        const competition = await competitionRepository.findOne({ where: { id } });
        if (!competition) {
            return NextResponse.json(
                { error: "Competition not found" },
                { status: 404 }
            );
        }

        // Validate SportType if provided
        if (sport_type_id) {
            const sportType = await sportTypeRepository.findOne({ where: { id: sport_type_id } });
            if (!sportType) {
                return NextResponse.json(
                    { error: "Sport type not found" },
                    { status: 404 }
                );
            }
        }

        competition.name = name || competition.name;
        competition.location = location || competition.location;
        competition.start_date = start_date || competition.start_date;
        competition.sport_type_id = sport_type_id || competition.sport_type_id;

        await competitionRepository.save(competition);

        return NextResponse.json(
            { message: "Competition updated successfully", data: competition },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating competition:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export const deleteCompetition = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        await initializeDataSource();

        const { id } = context.params;
        const competitionRepository = AppDataSource.getRepository(Competition);

        const competition = await competitionRepository.findOne({ where: { id } });
        if (!competition) {
            return NextResponse.json(
                { error: "Competition not found" },
                { status: 404 }
            );
        }

        await competitionRepository.remove(competition);

        return NextResponse.json(
            { message: "Competition deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting competition:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};