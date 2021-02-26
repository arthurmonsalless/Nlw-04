import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppError";



class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});

        if(!user) {
            throw new AppError("User does not exists")
            
        }

        const survey = await surveysRepository.findOne({id: survey_id});

        if(!survey) {
            throw new AppError("Survey does not exists!")
            
        }

       
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");


        const surveyUserAlreadExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"]
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL,
        };

        if(surveyUserAlreadExists) {
            variables.id = surveyUserAlreadExists.id
            await SendMailService.execute(email, survey.title, variables, npsPath)
            return response.json(surveyUserAlreadExists);
        }


        //salvar as informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })
        await surveysUsersRepository.save(surveyUser);
        //enviar e-mail para o usuário
        variables.id = surveyUser.id;
    
        await SendMailService.execute(email, survey.title, variables, npsPath);
        return response.json(surveyUser);
    }
}

export { SendMailController }