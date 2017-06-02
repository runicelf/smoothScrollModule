/**
 * Created by runicelf on 02.06.2017.
 */
'use strict';
const configObject = {
    classNameForAnchor: 'animate-anchor',
    smoothWheelScroll: {
        enabled : true,
        scroollDistance: 350,
        scrollDuration: 500,
        timingFunction : ((timePassed) => Math.pow(timePassed, 2)),
        timingFunctionReverse : true
    },
    smoothScrollToAnchor : {
        enablead: true,
        paddingTop: 50,
        scrollDuration: 500,
        timingFunction : ((timePassed) => Math.pow(timePassed, 2)),
        timingFunctionReverse : true ,
    },
};

function animate(draw, duration, timing, reverse = true) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction < 0) timeFraction = .01;
        if (timeFraction > 1) timeFraction = 1;
        const progress = reverse ? 1 - timing(1 - timeFraction) : timing(timeFraction);
        draw(progress);
        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}

function scrollStep(start, direction, commonDistance, timePassed) {
    const generalDistance = commonDistance;
    const distance = direction ? timePassed * generalDistance : timePassed * generalDistance * -1;
    window.scrollTo(0, distance + start);
}

function scrollToWithAnimate(elemOrDistance, duration, timing, timingReverse, padding) {
    const currentPosition = window.pageYOffset;
    if(typeof elemOrDistance === 'number') {
        animate(
            scrollStep.bind(null, currentPosition, true, elemOrDistance),
            duration,
            timing,
            timingReverse
        );
        return;
    }
    const purposePosition =  elemOrDistance.getBoundingClientRect().top + currentPosition,
        scrollDistance = currentPosition > purposePosition ? currentPosition - purposePosition : purposePosition - currentPosition;
    animate(
        scrollStep.bind(null, currentPosition, true, scrollDistance - padding),
        duration,
        timing,
        timingReverse
    );
}

function addAnchorsHolder(buttons, duration, timing, timingReverse, padding) {
    Object.keys(buttons).forEach(k => {
        const elem = buttons[k];
        elem.addEventListener('click', (e) => {
            e.preventDefault();
            const attr = elem.getAttribute('href').slice(1);
            const purpose = document.getElementsByName(attr)[0];
            if(!purpose) {
                throw new Error(`anchor with '${attr}' attribute not found`)
            }
            scrollToWithAnimate(purpose, duration, timing, timingReverse, padding);
        })
    })
}
if(configObject.smoothWheelScroll) {
    document.addEventListener('wheel', function (e) {
        const directionDown = e.deltaY > 0 ? 1 : -1;
        e.preventDefault();
        scrollToWithAnimate(
            configObject.smoothWheelScroll.scroollDistance * directionDown,
            configObject.smoothWheelScroll.scrollDuration,
            configObject.smoothWheelScroll.timingFunction,
            configObject.smoothWheelScroll.timingFunctionReverse
        );
    });
}
if(configObject.smoothScrollToAnchor) {
    const navButtons = document.getElementsByClassName(configObject.classNameForAnchor);
    addAnchorsHolder(
        navButtons,
        configObject.smoothScrollToAnchor.scrollDuration,
        configObject.smoothWheelScroll.timingFunction,
        configObject.smoothWheelScroll.timingFunctionReverse,
        configObject.smoothScrollToAnchor.paddingTop
    );
}
