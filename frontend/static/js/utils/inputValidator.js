export class InputValidator{
    static validate(input){
        const pattern = /<script|on\w+=|javascript:/i;
        return pattern.test(input);
    }
}