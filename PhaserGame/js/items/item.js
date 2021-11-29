class item{
    constructor(price = 0, xion_amount = 0, price_coeff = 1.12, frequency = 1000.0, multiplier = 1, player_owned = 0, autobuy = false){
        this.name = "";
        this.price = price;
        this.xion_amount = xion_amount; //xion quantity this item will give each generation
        this.price_coeff = price_coeff; //how many xion this item will increase in price everytime it was bought
        this.frequency = frequency; //ms between each xion generation
        this.multiplier = multiplier; //bonus to the item : raw_xion = xion_amount * multiplier
        this.player_owned = player_owned;
        this.autobuy = autobuy;

        this.xion_per_second = this.update_xion_per_second(); // item's xps = ( (xion_amount * quantity) * (delta/1000) )
    }

    set_name(new_name){
        this.name = new_name;
    }
    get_name(){
        return this.name;
    }

    set_price(new_value){
        this.price = new_value;
    }
    get_price(){
        return this.price;
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
    update_xion_per_second(){
        this.xion_per_second = this.xion_amount * this.player_owned * this.multiplier;
    }
    get_xion_per_second(){
        return this.xion_per_second;
    }

    // ITEM MULTIPLIER SETTER GETTER
    set_multiplier(new_value){
        this.multiplier = new_value;
    }
    get_multiplier(){
        return this.multiplier;
    }

    // ITEM OWNED BY PAYER SETTER AND GETTER
    set_player_owned(new_value){
        this.player_owned = new_value;
    }
    get_player_owned(){
        return this.player_owned;
    }

    // ITEM WILL BE AUTO BOUGHT IF TRUE
    set_autobuy(new_value){
        if(new_value != this.autobuy){
            this.autobuy = new_value;
        }
    }
    get_autobuy(){
        return this.autobuy;
    }

    // EVENTS
    _on_item_bought(){
        this.set_price(this.price * this.price_coeff);
        this.player_owned++;
        this.update_xion_per_second();
    }
}

class xion extends item{
    constructor(initial_price = 0, xion_amount = 1, price_coeff = 0, frequency = 0, multiplier = 1, player_owned = 1, autobuy = false){
        super(initial_price, xion_amount, price_coeff, frequency, multiplier, player_owned, autobuy);
        this.name = "xion";
    }
}

class autoclicker extends item{
    constructor(initial_price = 10, xion_amount = 1, price_coeff = 1.08, frequency = 5000.0, multiplier = 1, player_owned = 0, autobuy = false){
        super(initial_price, xion_amount, price_coeff, frequency, multiplier, player_owned, autobuy);
        this.name="autoclicker";
    }
}

class xiongenerator extends item{
    constructor(initial_price = 1000, xion_amount = 10, price_coeff = 1.12, frequency = 5000.0, multiplier = 1, player_owned = 0, autobuy = false){
        super(initial_price, xion_amount, price_coeff, frequency, multiplier, player_owned, autobuy);
        this.name = "xiongenerator";
    }
}

class xionextractor extends item{
    constructor(initial_price = 25000, xion_amount = 300, price_coeff = 1.12, frequency = 5000.0, multiplier = 1, player_owned = 0, autobuy = false){
        super(initial_price, xion_amount, price_coeff, frequency, multiplier, player_owned, autobuy);
        this.name = "xionextractor";
    }
}
