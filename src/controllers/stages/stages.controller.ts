import { NextRequest, NextResponse } from "next/server";
import { Competition, Stage } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import { AppDataSource } from "@/config";
import { z } from "zod";
import { StageType } from "@/entities/stage";



const createStageSchema = z.object({
    name: z.string().min(1, "Stage name is required").max(100),
    type: z.enum(["group", "semifinal", "final"], {
        errorMap: () => ({ message: "Invalid stage type" }),
    }),
});

const mapToStageType = (type: "group" | "semifinal" | "final"): StageType => {
    return StageType[type.toUpperCase() as keyof typeof StageType];
};



export const createStage = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        console.log(id)
        await initializeDataSource();

        const body = await req.json();
        const parsed = createStageSchema.parse(body); // Validate input

        const competitionRepo = AppDataSource.getRepository(Competition);
        const competition = await competitionRepo.findOneBy({ id: id });
        if (!competition) {
            return NextResponse.json(
                { message: "Competition not found" },
                { status: 404 }
            );
        }

        const stageRepository = AppDataSource.getRepository(Stage);
        const existingStage = await stageRepository
      .createQueryBuilder("stage")
      .where("stage.competition_id = :competitionId", { competitionId: id })
      .andWhere("LOWER(stage.name) = LOWER(:name)", { name: parsed.name.trim() })
    //   .andWhere("LOWER(stage.type)=LOWER(:type",{type:parsed.type.trim()})
      .getOne();

    if (existingStage) {
      return NextResponse.json(
        { message: `Stage name "${parsed.name.trim()}" already exists for this competition` },
        { status: 400 }
      );
    }
        const stage = stageRepository.create({ name: parsed.name, type: mapToStageType(parsed.type), competition_id:id });
        
        await stageRepository.save(stage);
        return NextResponse.json({ message: "Stage created successfully" }, { status: 201 });


    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Error creating stage" }, { status: 500 });

    }

}

export const getStages = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id } = params;
        console.log(id)
        const stageRepository = AppDataSource.getRepository(Stage);
        const stages = await stageRepository.findBy( { competition_id:id });
        return NextResponse.json(stages);
    }
    catch (err) {
        return NextResponse.json({ message: "Error fetching stages" ,err}, { status: 500 });
    }
}
export const getStage = async (_req: NextRequest, { params }: {
    params: {
        stage_id
        : string
    }
}) => {
    try {
        await initializeDataSource();
        const { stage_id } = params;
        const stageRepository = AppDataSource.getRepository(Stage);
        const stage = await stageRepository.findOneBy({ id:stage_id });
        if (!stage) {
            return NextResponse.json({ message: "Stage not found" }, { status: 404 });
        }
        return NextResponse.json(stage);
    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Error fetching stage" }, { status: 500 });
    }
}
export const updateStage = async (req: NextRequest, { params }: { params: { stage_id: string } }) => {
    try {
        await initializeDataSource();
        const { stage_id } = params;
        const stageRepository = AppDataSource.getRepository(Stage);
        const stage = await stageRepository.findOneBy({ id:stage_id });
        if (!stage) {
            return NextResponse.json({ message: "Stage not found" }, { status: 404 });
        }
        const { name, type } = await req.json();
        stage.name = name;
        stage.type = type;
        await stageRepository.save(stage);
        return NextResponse.json(stage);
    }
    catch (err) {
        return NextResponse.json({ message: "Error updating stage" ,err}, { status: 500 });
    }
}
export const deleteStage = async (_req: NextRequest, { params }: { params: { stage_id: string } }) => {
    try {
        await initializeDataSource();
        const { stage_id } = params;
        const stageRepository = AppDataSource.getRepository(Stage);
        const stage = await stageRepository.findOneBy({ id:stage_id });
        if (!stage) {
            return NextResponse.json({ message: "Stage not found" }, { status: 404 });
        }
        await stageRepository.delete(stage_id);
        return NextResponse.json({ message: "Stage deleted" });

    } catch (err) {
        return NextResponse.json({ message: "Error deleting stage",err }, { status: 500 });
    }
}