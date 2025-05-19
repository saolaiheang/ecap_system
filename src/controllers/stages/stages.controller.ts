import { NextRequest, NextResponse } from "next/server";
import { Competition, Stage } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import { AppDataSource } from "@/config";
import { z } from "zod";
import { StageType } from "@/entities/stage";
import { middleware } from "@/middleware/auth"
import { validate } from "class-validator";


const createStageSchema = z.object({
    name: z.string().min(1, "Stage name is required").max(100),
    type: z.enum(["group", "semifinal", "final"], {
        errorMap: () => ({ message: "Invalid stage type" }),
    }),
});

const mapToStageType = (type: "group" | "semifinal" | "final"): StageType => {
    return StageType[type.toUpperCase() as keyof typeof StageType];
};

const updateStageSchema = createStageSchema.partial();


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
        const stage = stageRepository.create({ name: parsed.name, type: mapToStageType(parsed.type), competition_id:id });
        await stageRepository.save(stage);
        return NextResponse.json({ message: "Stage created successfully" }, { status: 201 });


    } catch (err) {
        return NextResponse.json({ message: "Error creating stage" }, { status: 500 });

    }

}

export const getStages = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id: competition_id } = params;
        const stageRepository = AppDataSource.getRepository(Stage);
        const stages = await stageRepository.find({ where: { competition_id } });
        return NextResponse.json(stages);
    }
    catch (err) {
        return NextResponse.json({ message: "Error fetching stages" }, { status: 500 });
    }
}
export const getStage = async (req: NextRequest, { params }: {
    params: {
        id
        : string
    }
}) => {
    try {
        await initializeDataSource();
        const { id } = params;
        const stageRepository = AppDataSource.getRepository(Stage);
        const stage = await stageRepository.findOneBy({ id });
        if (!stage) {
            return NextResponse.json({ message: "Stage not found" }, { status: 404 });
        }
        return NextResponse.json(stage);
    }
    catch (err) {
        return NextResponse.json({ message: "Error fetching stage" }, { status: 500 });
    }
}
export const updateStage = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id } = params;
        const stageRepository = AppDataSource.getRepository(Stage);
        const stage = await stageRepository.findOneBy({ id });
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
        return NextResponse.json({ message: "Error updating stage" }, { status: 500 });
    }
}
export const deleteStage = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id } = params;
        const stageRepository = AppDataSource.getRepository(Stage);
        const stage = await stageRepository.findOneBy({ id });
        if (!stage) {
            return NextResponse.json({ message: "Stage not found" }, { status: 404 });
        }
        await stageRepository.delete(id);
        return NextResponse.json({ message: "Stage deleted" });

    } catch (err) {
        return NextResponse.json({ message: "Error deleting stage" }, { status: 500 });
    }
}