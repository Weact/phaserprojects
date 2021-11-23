class item{
    constructor(initial_price = 0, xion_amount, price_coeff = 1.0, frequency = 1000.0){
        this.initial_price = initial_price;
        this.xion_amount = xion_amount; //xion quantity this item will give each generation
        this.price_coeff = price_coeff; //how many xion this item will increase in price everytime it was bought
        this.frequency = frequency; //ms between each xion generation

        this.xion_per_second = 0.0; // item's xps = ( (xion_amount * quantity) * (delta/1000) ) 
    }

    set_initial_price(new_value){
        this.initial_price = new_value;
    }
    get_initial_price(){
        return this.initial_price;
    }

    // ITEM XION AMOUNT SETTER GETTER
    set_xion_amount(new_value){
        this.xion_amount = new_value;
    }
    get_xion_amount(){
        return this.xion_amount;
    }

    // ITEM COEFF SETTER GETTER
    set_price_coeff(new_price_coeff){
        this.price_coeff = new_price_coeff;
    }
    get_price_coeff(){
        return this.price_coeff;
    }

    // ITEM FREQUENCY SETTER GETTER
    set_frequency(new_frequency){
        this.frequency = new_frequency;
    }
    get_frequency(){
        return this.frequency;
    }

    // ITEM XPS SETTER GETTER
    set_xion_per_second(new_value){
        this.xion_per_second = new_value;
    }
    get_xion_per_second(){
        return this.xion_per_second;
    }
}

class autoclicker extends item{
    constructor(initial_price = 10, xion_amount = 1, price_coeff = 1.05, frequency = 5000.0){
        super(initial_price, xion_amount, price_coeff, frequency);
    }
}

class xiongenerator extends item{
    constructor(initial_price = 1000, xion_amount = 10, price_coeff = 1.12, frequency = 2500.0){
        super(initial_price, xion_amount, price_coeff, frequency);
    }
}