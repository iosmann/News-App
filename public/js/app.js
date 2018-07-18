$(document).on("click", "#scrapeButton",function(){
    console.log("click")
    $.get("/scrape")
    
})