import { ScheduleTraining } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import { AppDataSource } from "@/config";
import { NextResponse, NextRequest } from "next/server";



export const createScheduleTraining = async (req: NextRequest) => {
    try {
        await initializeDataSource();
        console.log("✅ Database connected successfully...");


        const { sport_type_id, date, time, location, team_id, coach_id } = await req.json() as ScheduleTraining;
        const scheduleRepository = AppDataSource.getRepository(ScheduleTraining);
        const schedule = scheduleRepository.create({ sport_type_id, date, time, location, team_id, coach_id })
        await scheduleRepository.save(schedule);
        return NextResponse.json(
            { message: "Schedule created successfully", data: schedule },
            { status: 201 }
        )


    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Failed to create schedule", err },
            { status: 500 }
        )
    }

}

export const getAllSchedules = async (req:NextRequest) => {
    try {
        await initializeDataSource();
        console.log("✅ Database connected successfully...");
        const scheduleRepository = AppDataSource.getRepository(ScheduleTraining);
        const schedules = await scheduleRepository.find();
        return NextResponse.json(
            { message: "Schedules retrieved successfully", data: schedules },
            { status: 200 }
        )
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Failed to retrieve schedules", err },
            { status: 500 }
        )
    }


}

export const getAllScheduleBySport= async(req:NextRequest,{params}:{params:{id:string}})=>{
    try{
        const {id}=params;
        await initializeDataSource();
        console.log("✅ Database connected successfully...");
        const scheduleRepository=AppDataSource.getRepository(ScheduleTraining);
        const schedule=await scheduleRepository.findOne({where:{sport_type_id:id}});
        if(!schedule){
            return NextResponse.json(
                {error:"schedules not found"},
                {status:404}
            )
        }
        return NextResponse.json({message:"Schedules by sport retrieved successfully ",data:schedule},
            {status:201}
        )
        

    }catch(err){
        console.log(err)
        return NextResponse.json(
            {error:"Error get schedule by sport"},
            {status:500}
        )

    }
}

export const deleteSchedule=async(req:NextRequest,{params}:{params:{id:string}})=>{
    try{
        const {id}=params;
        await initializeDataSource();
        console.log("✅ Database connected successfully...");
        const scheduleRepository=AppDataSource.getRepository(ScheduleTraining);
        const schedule=await scheduleRepository.findOne({where:{id}})
        if(!schedule){
            return NextResponse.json(
                {error:"schedule not found"},
                {status:404}
            )
        }
        await scheduleRepository.remove(schedule);
        return NextResponse.json(
            {message:"schedule deleted successfully"},
            {status:200}
        )

    }catch(err){
        console.log(err)
        return NextResponse.json(
            {error:"Error Deleting schedule"},
            {status:500}
        )

    }
}


export const updateSchedule= async (req:NextRequest,{params}:{params:{id:string}})=>{
    try{
        const {id}=params;
        await initializeDataSource();
        console.log("✅ Database connected successfully...");
        const {  date, time, location, coach_id } = await req.json() as ScheduleTraining;
        const scheduleRepository=AppDataSource.getRepository(ScheduleTraining);
        const schedule=await scheduleRepository.findOne({where:{id}})
        if(!schedule){
            return NextResponse.json({message:"schedule not found"},{status:404})
        }
        schedule.date=date
        schedule.time=time
        schedule.location=location;
        schedule.coach_id=coach_id
        await scheduleRepository.save(schedule)
        return NextResponse.json(
            {message:"Schedule updated successfully"},
            {status:201}
        )


    }catch(err){
        console.log(err)
        return NextResponse.json({message:"Failed to update schedule ",error:err},
            {status:500}
        )
    }
}