import  { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { AppError } from "../errors/AppError";


class AnswerController{


    /**
     * 
    Route Params => Parametros que compõe a rota / 
    routes.get("/answers/value")

    Query Params => Busca, Paginação, não obrigatórios
    ?
    chave=valor
     */

    async execute(request: Request, response: Response){
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

         if(!surveyUser) {
            throw new AppError("Survey User does not exists!");
        }

        // Caso o surveyUser existir, sobrescreve o null que estava no banco de dados, pelo valor avaliado
        surveyUser.value = Number(value); // Com o parse, forçar o value ser um number

        // Salvar no banco de dados a nota avaliado para a survey do user
        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }

}

export { AnswerController };