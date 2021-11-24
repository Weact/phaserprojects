class GameProgression{
    constructor(xion = 0, gear = 0, golden_gear = 0, items = []){
        this.xion = xion;
        this.gear = gear;
        this.golden_gear = golden_gear;
        this.items = items;
    }

    //XION
    set_xion(new_value = 0){
        this.xion = new_value;
        _on_xion_changed();
    }
    add_xion(value){
        this.xion = this.xion + value;
        _on_xion_changed();
    }
    remove_xion(value){
        this.xion = this.xion - value;
        _on_xion_changed();
    }
    get_xion(){
        return this.xion;
    }

    //GEAR
    set_gear(new_value){
        this.gear = new_value;
        _on_gear_changed();
    }
    get_gear(){
        return this.gear;
    }

    //GOLDEN GEAR
    set_golden_gear(new_value){
        this.golden_gear = new_value;
        _on_golden_gear_changed();
    }
    get_golden_gear(){
        return this.golden_gear;
    }

    //ITEMS

    add_item(new_item){ // ADD ITEM TO ITEMS PROGRESSION
        this.items.append(new_item);
        _on_item_added();
    }

    set_items(new_items = []){ // SET ALL THE ITEMS OF THE GAME PROGRESSION
        this.items = new_items;
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
        this.items.forEach(item => {
            if(item.get_name() != "xion" && this.get_xion() >= item.get_price()){
                console.log(item.get_name() + " has been found as buyable !");
                this.buy_item(item);
            }
        });
    }

    buy_item(item){ // BUY AN ITEM BY ITS NAME
        let item_current_price = item.get_price();

        this.remove_xion(item_current_price);
        if ( item != undefined ) { item._on_item_bought(); }

        let item_next_price = item.get_price();

        console.log(item + " has been bought for " + item_current_price + ". You now have " + item.get_player_owned() + ". Next price : " + item_next_price + ". Item earning per second: " + item.get_xion_per_second());
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
    let game_progression_dict = {}
    game_progression_dict_json = JSON.stringify(game_progression_dict);
    download_json(game_progression_dict_json, el);
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

        console.log(obj);
        console.log(obj[0]);
        console.log(Object.keys(obj));
        console.log(Object.values(obj));

        game_progression = obj;
        update_xion_collected_text();
    }
}

function download_json(json, el){
    var data = "text/json;charset=utf-8," + encodeURIComponent(json);
    el.setAttribute("href", "data:"+data);
    el.setAttribute("download", "data.json");
}