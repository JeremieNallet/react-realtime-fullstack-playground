import "./_StepIntro.scss";
import React, { useState, useEffect } from "react";
import { animated as a, useSprings, useSpring } from "react-spring";

//folder
import images from "../../assets/svgs/partyImg";
import CreatorLayout from "./CreatorLayout";
import CreatorControls from "./CreatorControls";
import { ArrowLeft, ArrowRight, Check } from "../../assets/svgs/icons";
import useResponsive from "../../hooks/useResponsive";

const StepIntro = ({ steps, info, setSteps }) => {
    const { isMobileScreen } = useResponsive();
    const [groupInfo, setGroupInfo] = info;
    const getGroupTitle = ({ target: { value } }) =>
        setGroupInfo({ ...groupInfo, title: value });
    const getGroupImg = (imgPath) =>
        setGroupInfo({ ...groupInfo, img: imgPath });
    const [minimum, setMinimum] = useState(null);
    const [focused, setFocused] = useState(false);
    const imgPerView = 3;
    const [imgIndex, setImgIndex] = useState(images.length);
    const [control, setControl] = useState({ right: true, left: true });
    const [transVal, setTransVal] = useState(0);

    const springTrans = useSpring({
        transform: `translate3d(${transVal}%, 0, 0)`,
        config: { mass: 0.1, tension: 50, friction: 5, clamp: true },
    });
    const borderBase = ".25rem solid";
    const borderColor = "#623ce9";
    const [springImages, setSpringImages] = useSprings(images.length, (_) => ({
        border: `${borderBase} white`,
        scale: "scale(1)",
        config: { mass: 0.1, tension: 70, friction: 2.5 },
    }));

    const nextSlide = () => {
        if (imgIndex > imgPerView) {
            setImgIndex((imgIndex) => imgIndex - imgPerView);
            setTransVal((val) => (val += -100));
        } else return;
    };
    const prevSlide = () => {
        if (images.length !== imgIndex) {
            setImgIndex((i) => i + imgPerView);
            setTransVal((val) => (val += +100));
        } else return;
    };
    useEffect(() => {
        setControl({
            right: imgIndex <= imgPerView,
            left: images.length === imgIndex,
        });
    }, [imgIndex]);

    const Slider = () => (
        <a.div style={springTrans} className="slider">
            {images.map((el, index) => {
                const setBorders = (i, color, scale, opacity) => {
                    if (i !== index)
                        return {
                            border: `${borderBase} white`,
                            opacity: opacity,
                        };
                    else
                        return {
                            border: `${borderBase} ${color}`,
                            opacity: 1,
                        };
                };
                const onSelect = (el) => {
                    getGroupImg(el.img);
                    setSpringImages((i) =>
                        setBorders(i, borderColor, 1.05, 0.7)
                    );
                };
                const onHover = () => {
                    if (!groupInfo.img) {
                        setSpringImages((i) =>
                            setBorders(i, borderColor, 1.025, 1)
                        );
                    }
                };

                const onLeave = () => {
                    if (!groupInfo.img) {
                        setSpringImages((i) => setBorders(i, "white", 1, 1));
                    }
                };

                return (
                    <React.Fragment key={index}>
                        {!isMobileScreen ? (
                            <a.div
                                style={{
                                    border: springImages[index].border,
                                    opacity: springImages[index].opacity,
                                }}
                                onMouseEnter={() => onHover()}
                                onMouseLeave={() => onLeave()}
                                onClick={(i) => onSelect(el)}
                                key={index}
                                className="slider__item"
                            >
                                <a.img
                                    className="slider__item--img"
                                    src={el.img}
                                    alt="group"
                                />
                            </a.div>
                        ) : (
                            <a.div
                                style={{
                                    border: springImages[index].border,
                                    opacity: springImages[index].opacity,
                                }}
                                onMouseEnter={() => onHover()}
                                onMouseLeave={() => onLeave()}
                                onClick={(i) => onSelect(el)}
                                key={index}
                                className="m-slider__items"
                            >
                                <img
                                    className="m-slider__items--img"
                                    src={el.img}
                                    alt="img"
                                />
                            </a.div>
                        )}
                    </React.Fragment>
                );
            })}
        </a.div>
    );

    useEffect(() => {
        setMinimum(groupInfo.title.length >= 5);
    }, [focused, groupInfo.title.length]);

    return (
        <CreatorLayout
            controls={
                <CreatorControls
                    enabled={groupInfo.img && groupInfo.title.length >= 5}
                    setSteps={setSteps}
                    steps={steps}
                    displayBack={false}
                    nextPath="/create/position"
                />
            }
            title="Name your group"
            steps={`${steps.current} on ${steps.total}`}
        >
            <div className={`step-intro ${isMobileScreen ? "m" : ""}`}>
                <div className="container input">
                    <div className="step-intro__input-group">
                        <span className="step-intro--section-title">
                            Title :{" "}
                        </span>
                        <input
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            value={groupInfo.title}
                            onChange={getGroupTitle}
                            className="step-intro__input-group--input"
                            type="text"
                            placeholder="Group title"
                            maxLength="40"
                        />
                        {minimum && (
                            <Check className="step-intro__input-group--sign check" />
                        )}

                        {!minimum && (
                            <small
                                style={{ color: "var(--color-theme-2)" }}
                                className="step-intro__input-group--limit"
                            >
                                minimum {5 - groupInfo.title.length} characters.
                            </small>
                        )}
                        {minimum && (
                            <small
                                style={{ color: "var(--color-theme-1)" }}
                                className="step-intro__input-group--limit"
                            >
                                maximum {40 - groupInfo.title.length}{" "}
                                characters.
                            </small>
                        )}
                    </div>
                </div>

                <div className="container slider">
                    <div className="step-intro__img-selector">
                        <span className="step-intro--section-title">
                            Choose an image :{" "}
                        </span>
                        {Slider()}
                        {!isMobileScreen && (
                            <div className="step-intro__img-selector--btns">
                                <button
                                    onClick={prevSlide}
                                    className={`selector-btn ${
                                        control.left ? "disabled" : ""
                                    }`}
                                >
                                    <ArrowLeft />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className={`selector-btn ${
                                        control.right ? "disabled" : ""
                                    }`}
                                >
                                    <ArrowRight />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CreatorLayout>
    );
};

export default StepIntro;
