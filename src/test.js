const log = (message)=>{
    console.log(message);
}

const intro = (name)=>{
    return `I am ${name}`;
}

const name = "Alistaire Dominik Suh";

export {
    log,            //named export
    intro,          //named export 
    name as default //default export(only one per file)
};