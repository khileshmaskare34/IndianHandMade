
var ps = gsap.timeline();


ps.from("#l1",{
    y: -1000,
    stagger: .1,
    // duration: .1,
    ease:"ease",
    // delay:1,
});
ps.from("#l2",{
    y: -1000,
    // duration: .5,
    ease:"ease",
    stagger: .1,
    // opacity:0,
    // delay:.1,
});
ps.from("#l3",{
    y: -1000,
    // duration: .1,
    ease:"ease",
    stagger: .1,
    // opacity:0,
    // delay:.1,
});
ps.from("#l4",{
    y: -1000,
    // duration: .1,
    ease:"ease",
    stagger: .1,
    // opacity:0,
    // delay:.1,
});
ps.from("#l5",{
    y: -1000,
    // duration: .1,
    ease:"ease",
    // opacity:0,
    // delay:0,
});
ps.from(".a",{
    y:20,
    duration:.1,
    stagger:.1,
    opacity:0,
})
// ps.to("#img1",{
//     duration:1,
//     scale:1,
//     delay:.5,
// })


