setSize();

window.addEventListener('resize', function(){
    var height = window.innerHeight;
    document.getElementById('frame').height = height + "px"
}, true);

function setSize(){
    var height = window.innerHeight;
    document.getElementById('frame').height = height + "px";
}
