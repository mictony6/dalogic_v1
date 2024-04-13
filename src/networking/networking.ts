class Networking {
    instance : Networking  = null;

    constructor(){
        if (this.instance !== null){
            return this.instance;
        }
        this.instance = this;
    }
}