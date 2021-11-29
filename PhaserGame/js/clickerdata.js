class GameProgression{
    constructor(xion = 0, gear = 0, golden_gear = 0, xion_lost_rate = 0.3, gear_lost_rate = 0.3, golden_gear_lost_rate = 0.3, items = []){
        this.xion = xion;
        this.gear = gear;
        this.golden_gear = golden_gear;

        this.xion_lost_rate = xion_lost_rate;
        this.gear_lost_rate = gear_lost_rate;
        this.golden_gear_lost_rate = golden_gear_lost_rate;

        this.items = items;
    }

    //XION
    set_xion(new_value = 0){
        if(new_value != this.xion){
            this.xion = new_value;
            _on_xion_changed();
        }
    }
    set_xion_lost_rate(new_value){
        if(this.xion_lost_rate != new_value){
            this.xion_lost_rate = new_value;
        }
    }
    get_xion(){
        return this.xion;
    }
    add_xion(value){
        if(this.xion + value != this.xion){
            this.xion = this.xion + value;
            _on_xion_changed();
        }
    }
    remove_xion(value){
        if(this.xion - value != this.xion){
            this.xion = this.xion - value;
            _on_xion_changed();
        }
    }
    
    //GEAR
    set_gear(new_value){
        if(new_value != this.gear){
            this.gear = new_value;
            _on_gear_changed();
        }
    }
    set_gear_lost_rate(new_value){
        if(this.gear_lost_rate != new_value){
            this.gear_lost_rate = new_value;
        }
    }
    get_gear(){
        return this.gear;
    }
    add_gear(value){
        this.gear = this.gear + value;
        _on_gear_changed();
    }
    remove_gear(value){
        this.gear = this.gear - value;
        _on_gear_changed();
    }

    //GOLDEN GEAR
    set_golden_gear(new_value){
        if(new_value != this.golden_gear){
            this.golden_gear = new_value;
            _on_golden_gear_changed();
        }
    }
    set_golden_gear_lost_rate(new_value){
        if(this.set_golden_gear_lost_rate != new_value){
            this.set_golden_gear_lost_rate = new_value;
        }
    }
    get_golden_gear(){
        return this.golden_gear;
    }
    add_golden_gear(value){
        this.golden_gear = this.golden_gear + value;
        _on_golden_gear_changed();
    }
    remove_golden_gear(value){
        this.golden_gear = this.golden_gear - value;
        _on_golden_gear_changed();
    }

    //ITEMS

    add_item(new_item){ // ADD ITEM TO ITEMS PROGRESSION
        this.items.append(new_item);
        _on_item_added();
    }

    set_items(new_items = []){ // SET ALL THE ITEMS OF THE GAME PROGRESSION
        if(new_items != this.items){
            this.items = new_items;
        }
    }

    get_items(){ // GET ALL ITEMS FROM PROGRESSION
        return this.items;
    }

    get_item(item_index = 0){ // GET SPECIFIC ITEM FROM PROGRESSION
        return this.items[item_index]
    }

    get_item_by_name(item_name = ""){

        this.items.forEach(item => {

            let current_item_name = item.get_name();

            if(current_item_name == item_name){
                if(item != undefined){
                    return item;
                }else{
                    return undefined;
                }
            }else{
                return undefined;
            }
        });
    }

    check_for_items(){
        let buyable_items = []

        this.items.forEach(item => {
            if(item.get_name() != "xion" && this.get_xion() >= item.get_price()){
                if(item.get_autobuy() == true){
                    this.buy_item(item);
                }else{
                    buyable_items.push(item);
                }
            }
        });

        return buyable_items;
    }

    buy_item(item){ // BUY AN ITEM BY ITS NAME
        if(item != undefined && this.get_xion() > item.get_price() ){
            let item_current_price = item.get_price();

            this.remove_xion(item_current_price);

            item._on_item_bought();
    
            let item_next_price = item.get_price();
    
            display_buildings_cost_and_own();
        }
    }
}

var game_progression = {
    xion: 0,

    gear: 0,
    golden_gear: 0,

    multiplier: 1.0,


    upgrade_one_bought: false,
    upgrade_two_bought: false,
    upgrade_three_bought: false,
    upgrade_four_bought: false,

    autoclick_enabled: false,
    autoclick_frequency: 5000,

    items: [] //0: xion 1: autoclicker 2: generator
}

function save_game(el){
    let game_progression_json = JSON.stringify(myGameProgression);
    download_json(game_progression_json, el);
}

function load_game(el){
    const file_selector = document.getElementById('importGameData');

    file_selector.addEventListener('change', (event) => {

        const file_list = event.target.files;
        
        var file_reader = new FileReader();
        file_reader.onload = onReaderLoad;
        file_reader.readAsText(file_list[0]);
    })

    function onReaderLoad(event){
        obj = JSON.parse(event.target.result);
        set_progression_data(obj);
    }
}

function download_json(json, el){
    var data = "text/json;charset=utf-8," + encodeURIComponent(json);
    el.setAttribute("href", "data:"+data);
    el.setAttribute("download", "data.json");
}

function set_progression_data(obj){
    //console.log("Keys: " + Object.keys(obj));
    //console.log("Values: " + Object.values(obj));

    let new_items = obj.items;
    
    Object.keys(obj).forEach(obj_keys => {
        let setter = `set_${obj_keys}`;
        let value = obj[obj_keys];

        switch (setter) {
            case 'set_xion': myGameProgression.set_xion(value); break;
            case 'set_gear': myGameProgression.set_gear(value); break;
            case 'set_golden_gear': myGameProgression.set_golden_gear(value); break;
            case 'set_xion_lost_rate': myGameProgression.set_xion_lost_rate(value); break;
            case 'set_gear_lost_rate': myGameProgression.set_gear_lost_rate(value); break;
            case 'set_golden_gear_lost_rate': myGameProgression.set_golden_gear_lost_rate(value); break;
            case 'set_items': myGameProgression.set_items(new_items); break;
            default: console.log("#### WARNING : INVALID SETTER ####"); break;
        }
    });

    refresh_ui();
}