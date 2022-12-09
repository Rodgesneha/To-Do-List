    // const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // const weekday = today.getDay();
    // let day = days[weekday];

    // if(weekday === 6 || weekday === 0 ){
    //     day = "weekend";
    // }else{
    //     day = "weekday";
    // }

    // res.send(`Its a ${day}`);
    
module.exports.getDate = function(){
    
    const today = new Date();
    const options = {
        weekday : 'long',
        day : 'numeric',
        month : 'long'
    }
    return today.toLocaleDateString('en-US', options);
    
}

module.exports.getDay = function(){
    
    const today = new Date();
    const options = {
        weekday : 'long'
    }
    return today.toLocaleDateString('en-US', options);
    
}