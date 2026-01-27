export interface IUser {
    name: string;
    email: string;
    password: string;
    preferences: {
        currency: string;
        timezone: string;
        theme: "light" | "dark";
    };
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
}
