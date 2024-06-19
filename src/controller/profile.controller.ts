import { Request, Response } from "express";
import Profile from "../models/profile";

export async function getProfiles(_req: Request, res: Response){
    const profiles = await Profile.find();
    res.status(200).json(profiles)
}


export async function postProfile(req: Request, res: Response){
    const { url } = req.body;

    const newProfile = new Profile({
        url: url
    })

    await newProfile.save();

    res.status(200).json({message: 'Ok', newProfile})
}