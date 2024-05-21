import { User } from "firebase/auth";
type location = {
    lat: number,
    lng: number
}

type Car =
    {
        id: string
        model: string
        manufacturer: string
        lastCheckup: Date
        lastWash: Date
        fuelLevel: Number
        location: location
    }

type Group = {
    cars: Car[]
    users: UserScheme[]
}

type UserScheme = User & {
    groups: Group[]
}