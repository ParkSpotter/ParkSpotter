import { User } from "firebase/auth";
import { Image } from "react-native-elements/dist/image/Image";
type Location = {
    lat: number,
    lng: number
}

export type Car =
    {
        id: string
        model: string
        manufacturer: string
        lastCheckup: Date
        lastWash: Date
        fuelLevel: Number
        location: Location
    }

export type Group = {
    cars: Car[]
    users: UserScheme[]
}

export type UserScheme = User & {
    groups: Group[]
    photo? :Image
}
