import { NextRequest, NextResponse } from "next/server";
import { Activities, SportType } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import { AppDataSource } from "@/config";
import fs, { writeFile } from "fs/promises";
import cloudinary from "@/lib/cloudinary";
import os from "os";
import slugify from "slugify";

export const config = {
    api: {
        bodyParser: false,
    },
};
export const createActivities = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id: sport_id } = params;
        await initializeDataSource();
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const videoFile = formData.get("video") as File;

        if (!title || !title || !description || !sport_id) {
            return new Response(JSON.stringify({ error: "Please fill all the fields" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }


        const sportTypeRepository = AppDataSource.getRepository(SportType);
        const sportType = await sportTypeRepository.findOne({ where: { id: sport_id } });
        if (!sportType) {
            return NextResponse.json(
                { error: "Sport type not found" },
                { status: 404 }
            );
        }
        if (!videoFile) {
            return new Response(JSON.stringify({ error: "Video is required" }), {
                status: 400,
            })
        }
        if (!videoFile.type.startsWith("video/")) {
            return NextResponse.json(
                { error: "Only video files are allowed" },
                { status: 400 }
            );
        }
        const safeTitle = slugify(title, { lower: true, strict: true });
        const tempFilePath = `${os.tmpdir()}/${videoFile.name}-${Date.now()}`;
        const fileBuffer = Buffer.from(await videoFile.arrayBuffer());
        await writeFile(tempFilePath, fileBuffer);
        const videoFileUrl = await cloudinary.uploader.upload(tempFilePath, {
            folder: "activities",
            public_id: `${safeTitle}-${Date.now()}`,
            resource_type: "video",
        });
        await fs.unlink(tempFilePath);

        const activitiesRepository = AppDataSource.getRepository(Activities);
        const activity = activitiesRepository.create({
            title,
            description,
            video: videoFileUrl.secure_url,
            sport_id: sport_id,
        });
        await activitiesRepository.save(activity);

        return NextResponse.json(
            { message: "Activity created successfully", activity },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to create activity" }), {
            status: 500,
        })


    }
}

export const getAllActbySport = async (_req: NextRequest,context: { params: { id: string } }) => {
    try {
      await initializeDataSource();
      const sport_id =context.params.id;
      const activitiesRepository = AppDataSource.getRepository(Activities);
  
      const activities = await activitiesRepository.find({
        where: { sport_id:sport_id },
        relations: ["sportType"],
      });
  
      if (!activities || activities.length === 0) {
        return NextResponse.json(
          { message: "No activities found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(activities); 
  
    } catch (err) {
        console.error(err);
      return NextResponse.json(
        { error: "Failed to get activities" },
        { status: 500 }
      );
    }
  };
  
export const getActivityById = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id: activity_id } = params;
        const activitiesRepository = AppDataSource.getRepository(Activities);
        const activity = await activitiesRepository.findOne({
            where: { id: activity_id },
            relations: ["sportType"],
        });
        if (!activity) {
            return NextResponse.json({
                message: "Activity not found",
                status: 404,
            })
        }
        return NextResponse.json(activity);
    } catch (error) {
        return NextResponse.json({
            error: "Failed to get activity",
            status: 500,
        })
    }
}

export const deleteActivities = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id: activity_id } = params;
        const activitiesRepository = AppDataSource.getRepository(Activities);
        const activity = await activitiesRepository.findOne({
            where: { id: activity_id },
            relations: ["sportType"],
        });
        if (!activity) {
            return NextResponse.json({
                message: "Activity not found",
                status: 404,
            })
        }
        await activitiesRepository.delete(activity_id);
        return NextResponse.json({
            message: "Activity deleted",
            status: 200,
        })
    } catch (error) {
        return NextResponse.json({
            error: "Failed to delete activity",
            status: 500,
        })
    }
}

export const editeActivities = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id: activity_id } = params;
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const sport_id = formData.get("sport_id") as string;

        const activitiesRepository = AppDataSource.getRepository(Activities);
        const activity = await activitiesRepository.findOne({
            where: { id: activity_id },
            relations: ["sportType"],
        });

        if (!activity) {
            return NextResponse.json({
                message: "Activity not found",
                status: 404,
            });
        }

        if (title) activity.title = title;
        if (description) activity.description = description;
        if (sport_id) {
            const sportTypeRepository = AppDataSource.getRepository(SportType);
            const sportType = await sportTypeRepository.findOne({ where: { id: sport_id } });
            if (!sportType) {
                return NextResponse.json(
                    { error: "Sport type not found" },
                    { status: 404 }
                );
            }
            activity.sport_id = sport_id;
        }

        await activitiesRepository.save(activity);
        return NextResponse.json({
            message: "Activity updated",
            activity,
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({
            error: "Failed to update activity",
            status: 500
        })
    }

}
