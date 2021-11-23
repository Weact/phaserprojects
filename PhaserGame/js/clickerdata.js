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
    autoclick_frequency: 5000
}

function save_game(el){
    game_progression_json = JSON.stringify(game_progression);
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
        game_progression = obj;
        update_xion_collected_text();
    }
}

function download_json(json, el){
    var data = "text/json;charset=utf-8," + encodeURIComponent(json);
    el.setAttribute("href", "data:"+data);
    el.setAttribute("download", "data.json");
}