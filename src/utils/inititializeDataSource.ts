import { AppDataSource } from "@/config";

let isInitialized = false;

const initializeDataSource = async (): Promise<void> => {
    if (!isInitialized) {
        try {
            // console.log(process.env);
            await AppDataSource.initialize();
            isInitialized = true;
            console.log("DataSource initialized successfully");
        } catch (error) {
            console.error("Error initializing DataSource:", error);
            throw new Error("Failed to initialize DataSource");
        }
    }
};

const shutdownDataSource = async (): Promise<void> => {
    if (isInitialized) {
        try {
            await AppDataSource.destroy();
            isInitialized = false;
            console.log("DataSource shut down successfully");
        } catch (error) {
            console.error("Error shutting down DataSource:", error);
            throw new Error("Failed to shut down DataSource");
        }
    }
};

// Export functions for use in other files
export { initializeDataSource, shutdownDataSource };