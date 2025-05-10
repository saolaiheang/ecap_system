// import {  NextResponse } from "next/server";
// import { AppDataSource } from "@/config";
// import { Team } from "@/entities";
// import { SportType } from "@/entities";
// import { Competition } from "@/entities";

// export const createTeam = async (name: string, division: string, sport_id: string, id: string) => {
//     if (!AppDataSource.isInitialized) {
//         await AppDataSource.initialize();
//     }
//     const teamRepository = AppDataSource.getRepository(Team);
//     const typeOfSportRepository = AppDataSource.getRepository(SportType);
//     const competitionRepository = AppDataSource.getRepository(Competition);
//     const typeOfSport = await typeOfSportRepository.findOne({ where: { id: sport_id
//         } });
//         const competition = await competitionRepository.findOne({ where: { id: id
//             } });
//             if (!typeOfSport || !competition) {
//                 return { status: 404, message: "Type of sport or competition not found" };
//                 }
//                 const team = teamRepository.save({ name, division, typeOfSport, competition });

  
//     const sportType = await typeOfSportRepository.findOne({ where: { id: sport_id } });
//     if (!sportType) {
//       throw new Error("Sport type not found");
//     }
//     (await team).typeOfSport = sportType;
  
//     const competitions = await competitionRepository.findBy({ id: sport_id });
//     if (competitions.length > 0) {
//       (await team) = competitions;
//     }
  
//     console.log("Team before save:", team); // <-- Add this to debug
  
//     await teamRepository.save(await team);
  
//     const savedTeam = await teamRepository.findOne({
//       where: { id: (await team).id },
//       relations: ["typeOfSport", "competitions"],
//     });
  
//     if (!savedTeam) {
//       throw new Error("Team not saved correctly");
//     }
  
//     return savedTeam;
//   };
  



import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/config";
import { Team, SportType } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";

export const createTeam = async (req: NextRequest, division: any, sport_id: any, id: string) => {
    try {
        await initializeDataSource();

        // Parse request body
        const { name, division, sport_id, contact_info } = await req.json();

        // Validate input
        if (!name || !division || !sport_id) {
            return NextResponse.json(
                { error: "Name, division, and sport_id are required" },
                { status: 400 }
            );
        }

        // Initialize repositories
        const teamRepository = AppDataSource.getRepository(Team);
        const typeOfSportRepository = AppDataSource.getRepository(SportType);

        // Check if sport type exists
        const sportType = await typeOfSportRepository.findOne({ where: { id: sport_id } });
        if (!sportType) {
            return NextResponse.json(
                { error: "Sport type not found" },
                { status: 404 }
            );
        }

        // Create new team
        const team = teamRepository.create({
            name,
            division,
            sport_type_id: sportType.id,
            contact_info: contact_info || null,
        });

        // Save the team
        await teamRepository.save(team);

        // Fetch the saved team with its sport type relation
        const savedTeam = await teamRepository.findOne({
            where: { id: team.id },
            relations: ["sportType"],
        });

        if (!savedTeam) {
            return NextResponse.json(
                { error: "Team not saved correctly" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Team created successfully", data: savedTeam },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating team:", error);
        return NextResponse.json(
            { error: "Error creating team" },
            { status: 500 }
        );
    }
};