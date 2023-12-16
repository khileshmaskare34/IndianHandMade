let nav = document.querySelector("nav");
  gsap.from("#cover1",{
    x: "-100%",
    duration: 1,
    ease: Expo.easeInOut
  })
  nav.addEventListener('mouseenter',()=>{
    gsap.to('.cover',{
        height: "100%",
        duration: .5,
        ease: Expo.easeOut
    })
    gsap.to(".cover>span",{
        opacity: 1,
        duration: .1
    })
  })
  nav.addEventListener('mouseleave',()=>{
    gsap.to('.cover',{
        height: "0",
        duration: .5,
        ease: Expo.easeOut
    })
    gsap.to('#cover1',{
        height: "3px",
        duration: .5,
        ease: Expo.easeOut
    })
    gsap.to(".cover>span",{
        opacity: 0,
        duration: .1
    })
  })
  let nav2 = document.querySelectorAll("#nav2");
  nav2.forEach((option, i)=>{
      option.children[2].addEventListener("mouseenter",(dets)=>{
          console.log(dets.target.children[i])
          gsap.to(dets.target.children[0],{
              width:"100%",
              ease: Expo.easeInOut,
              duration: .5
          })
      })
      option.children[2].addEventListener("mouseleave",(dets)=>{
          
      })
  })

  function clickcart() {
    counter = counter + 1;
    document.getElementById("count").innerHTML = counter;
    var action = gsap.timeline();
    action
      .to("#count", {
        duration: 0.4,
        scale: 1.3,
        ease: "circ.out"
      })
      .to("#count", {
        duration: 0.5,
        scale: 1,
        ease: "circ.out"
      });
    var action2 = gsap.timeline();
  
    action2
      .to("#button", {
        duration: 0.4,
        scale: 0.93,
        ease: "power2.out"
      })
      .to("#button", {
        duration: 0.4,
        scale: 1,
        ease: "power2.out"
      });
  }


  // <script type="text/javascript">

  $( document ).ready(function(){

      $("#section").click(function(){
         // remove active class from all images
        $(".small-image").removeClass('active');
        $("#show_image_popup").slideUp();
      })
  
      $(".imgbox").click(function(){
          // remove active class from all images
         $(".imgbox").removeClass('active');
        // add active class
         $(this).addClass('active');
  
        var image_path = $(this).attr('src'); 
        $("#show_image_popup").fadeOut();
        // now st this path to our popup image src
        $("#show_image_popup").fadeIn();
        $("#large-image").attr('src',image_path);
  
      })
})


// document.body.style.backgroundColor = "red";