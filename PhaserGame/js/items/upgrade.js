class upgrade{
    constructor(price = 0, buymode = ""){
        this.price = price;
        this.buymode = buymode;
    }

    set_price(new_price){
        this.price = new_price;
    }
    get_price(){
        return this.price;
    }

    set_buymode(new_buymode){
        this.buymode = new_buymode
    }
    get_buymode(){
        return this.buymode;
    }
}

class multiplierUpgrade extends upgrade{
    constructor(price = 0, buymode = "", multiplier = 1){
        super(price, buymode);
        this.multiplier = multiplier;
    }

    set_multiplier(new_multiplier){
        this.multiplier = new_multiplier;
    }
    get_multiplier(){
        return this.multiplier;
    }
}