import { NextRequest, NextResponse } from "next/server";
import { User } from "../../entities/user";
import { AppDataSource } from "../../config";
import { generateToken } from '../../utils/encrypt';



export const createUser = async (req: NextRequest) => {
    try {
        const { userName, email, password, role } = await req.json(); 

        if (!userName || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = new User();
        user.name = userName;
        user.email = email;
        user.password = password;
        user.role = role || "Public";
        await userRepository.save(user);

        return NextResponse.json(
            { message: "User created successfully", user },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};
export const login = async (email:string,password: string | undefined) => {
    try {
        

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (user.password !== password) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role as "Public" | "Admin" | "SupperAdmin",
          });
        return NextResponse.json(
            { message: "Login successful", token },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error logging in user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};
