import React, { useState, useEffect, useRef, useCallback } from "react";
import { Figure2, BannerWrapper } from "./Style";
import { NavLink, useHistory } from "react-router-dom";
import { Row, Col } from "antd";
import { Main } from "../styled";
import { Button } from "../../components/buttons/buttons";
import { Cards } from "../../components/cards/frame/cards-frame";
import { PageHeader } from "../../components/page-headers/page-headers";
import {
  getItem,
  setItem,
  removeItem,
} from "../../utility/localStorageControl";
import { faBedPulse } from "@fortawesome/free-solid-svg-icons";
const Application = (props) => {
  const history = useHistory();
  const [viewBingage, setViewBingage] = useState(getItem("bingage_enable"));
  const [waiterApp, setWaiterApp] = useState(getItem("waiter_app_enable"));
  const [inventory, setInventory] = useState(getItem("inventrory_app_enable"));
  const [onlineOrder, setOnlineOrder] = useState(getItem("dyno_api_enable"));
  return (
    <>
      <Main>
        <PageHeader
          ghost
          title="Enhance your POS capabilities with PosEase Apps."
        />
        <Cards headless>
          <Row gutter={25}>
            <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "#5F63F2",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src={require(`../../static/img/app/bingage.png`)}
                      // src="https://web.Posease.com/assets/img/bingage.png"
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2>CRM</h2>
                      <p className="textWhite">
                        Loyalty, coupons, referral and marketing campaigns.
                      </p>
                      {viewBingage ? (
                        <span>
                          <Button
                            size="large"
                            type="white"
                            onClick={() => {
                              setItem("bingage_enable", false);
                              setViewBingage(false);
                            }}
                          >
                            Remove
                          </Button>{" "}
                          <Button
                            size="large"
                            type="white"
                            onClick={() => {
                              setItem("bingage_enable", true);
                              setViewBingage(true);
                              history.push("/settings/bingages");
                            }}
                          >
                            View
                          </Button>
                        </span>
                      ) : (
                        <Button
                          size="large"
                          type="white"
                          onClick={() => {
                            setItem("bingage_enable", true);
                            setViewBingage(true);
                            history.push("/settings/bingages");
                          }}
                        >
                          Enable App
                        </Button>
                      )}
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
            <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "#FEDD50",
                    borderRadius: "10px",
                    Height: "240px",
                  }}
                  headless
                >
                  <Figure2>
                    <figcaption>
                      <h2 style={{ color: "red" }}>Online Orders</h2>
                      <p style={{ color: "red" }}>
                        Accept and Manage Swiggy Zomato orders inside PosEase
                      </p>
                      <Row
                        style={{
                          justifyContent: "space-between",
                        }}
                      >
                        <Col>
                          {onlineOrder ? (
                            <span>
                              <Button
                                size="large"
                                type="white"
                                onClick={() => {
                                  setItem("dyno_api_enable", false);
                                  setOnlineOrder(false);
                                }}
                              >
                                Remove
                              </Button>{" "}
                              <Button
                                size="large"
                                type="white"
                                onClick={() => {
                                  setItem("dyno_api_enable", true);
                                  setOnlineOrder(true);
                                  history.push("/settings/dyno");
                                }}
                              >
                                View
                              </Button>
                            </span>
                          ) : (
                            <Button
                              size="large"
                              type="white"
                              onClick={() => {
                                setItem("dyno_api_enable", true);
                                setOnlineOrder(true);
                                history.push("/settings/dyno");
                              }}
                            >
                              Enable App
                            </Button>
                          )}
                        </Col>
                        <Col>
                          <svg
                            width="100px"
                            height="100px"
                            focusable="false"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            data-testid="OfflineBoltIcon"
                          >
                            <path d="M12 2.02c-5.51 0-9.98 4.47-9.98 9.98s4.47 9.98 9.98 9.98 9.98-4.47 9.98-9.98S17.51 2.02 12 2.02zM11.48 20v-6.26H8L13 4v6.26h3.35L11.48 20z"></path>
                          </svg>
                        </Col>
                      </Row>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
            <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "green",
                    borderRadius: "10px",
                    Height: "240px",
                  }}
                  headless
                >
                  <Figure2>
                    <figcaption>
                      <h2>Waiter/Captain App</h2>
                      <p>
                        Allow your waiter/captain to take orders directly from
                        mobile/Tablet.
                      </p>
                      <Row
                        style={{
                          justifyContent: "space-between",
                        }}
                      >
                        <Col>
                          {waiterApp ? (
                            <span>
                              <Button
                                size="large"
                                type="white"
                                onClick={() => {
                                  setItem("waiter_app_enable", false);
                                  setWaiterApp(false);
                                }}
                              >
                                Remove
                              </Button>{" "}
                              <Button
                                size="large"
                                type="white"
                                onClick={() => {
                                  setItem("waiter_app_enable", true);
                                  setWaiterApp(true);
                                  history.push("/settings/registers");
                                }}
                              >
                                View
                              </Button>
                            </span>
                          ) : (
                            <Button
                              size="large"
                              type="white"
                              onClick={() => {
                                setItem("waiter_app_enable", true);
                                setWaiterApp(true);
                                history.push("/settings/registers");
                              }}
                            >
                              Enable App
                            </Button>
                          )}
                        </Col>
                        <Col>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.0"
                            width="100px"
                            height="100px"
                            style={{ filter: "invert(1)" }}
                            viewBox="0 0 512.000000 512.000000"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g
                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                              fill="#000000"
                              stroke="none"
                            >
                              <path d="M962 5100 c-137 -36 -262 -131 -330 -251 -67 -117 -72 -164 -72 -625 0 -445 3 -424 -51 -424 -32 0 -114 -47 -143 -81 -41 -49 -58 -87 -63 -149 -8 -83 18 -152 77 -210 l47 -46 -33 -22 c-18 -12 -47 -45 -63 -74 -64 -111 -48 -222 44 -315 l54 -54 -40 -36 c-63 -57 -83 -105 -84 -193 0 -64 4 -82 27 -122 16 -25 44 -59 63 -75 l35 -29 -53 -55 c-56 -58 -77 -106 -77 -179 0 -106 55 -183 181 -256 l79 -46 0 -407 c0 -374 2 -414 20 -485 50 -196 202 -344 401 -391 51 -12 136 -15 410 -15 l347 0 41 -70 c79 -132 204 -242 348 -306 156 -70 398 -103 615 -84 l129 11 37 -29 c20 -17 57 -40 82 -53 l45 -24 785 0 785 0 46 23 c151 74 214 247 145 397 -24 52 -76 108 -412 446 l-385 386 -15 159 c-42 467 -101 687 -236 887 -22 32 -54 74 -71 94 l-32 36 -5 401 -5 401 -27 50 c-43 83 -115 135 -205 150 l-43 7 0 596 c0 657 -1 666 -62 790 -39 78 -131 175 -210 220 -31 18 -91 41 -134 52 -74 19 -111 20 -998 19 -875 0 -925 -1 -994 -19z m295 -227 c77 -145 127 -202 211 -241 l57 -27 420 0 420 0 57 27 c84 39 134 96 210 238 l66 125 109 -1 c86 -1 119 -5 163 -23 111 -43 196 -128 242 -241 23 -55 23 -56 26 -687 l3 -632 -28 -15 c-38 -20 -77 -62 -105 -116 l-23 -45 -5 -720 -5 -720 -43 -80 c-94 -176 -170 -419 -193 -618 -11 -96 -7 -304 7 -385 l6 -33 -923 3 -924 3 -55 23 c-113 46 -196 129 -242 242 -22 53 -23 67 -26 447 l-3 393 58 -34 c98 -57 154 -67 242 -40 72 21 141 90 166 163 34 103 5 204 -81 280 -26 22 -42 41 -37 41 16 0 84 73 106 115 16 30 21 58 22 110 0 101 -36 163 -134 232 -3 2 14 19 38 39 23 20 51 54 62 77 27 52 35 142 19 193 -16 49 -65 118 -95 134 -23 12 -23 13 30 64 77 76 101 161 71 260 -29 95 -59 120 -325 271 l-140 80 -1 425 c0 353 3 436 16 485 49 192 211 312 421 314 l72 1 68 -127z m1303 122 c0 -8 -72 -139 -98 -178 -14 -21 -46 -50 -71 -65 l-46 -27 -389 -3 -389 -3 -54 26 c-29 15 -64 41 -77 58 -23 32 -106 181 -106 192 0 3 277 5 615 5 338 0 615 -2 615 -5z m-1763 -1425 c199 -114 218 -128 234 -177 29 -89 -40 -183 -134 -183 -43 0 -420 213 -450 254 -39 54 -31 146 17 185 29 24 87 39 122 31 19 -4 114 -54 211 -110z m2643 -279 c20 -10 44 -36 57 -61 23 -43 23 -47 23 -435 l0 -392 65 -83 c186 -236 242 -433 291 -1035 l6 -80 403 -405 c377 -379 403 -408 414 -453 21 -87 -15 -169 -92 -206 -43 -21 -54 -21 -785 -21 -611 0 -748 2 -775 14 -18 7 -56 35 -86 61 -46 39 -59 46 -84 41 -74 -15 -270 -27 -342 -21 -196 15 -328 54 -452 131 -72 45 -161 132 -189 185 l-15 29 504 0 504 0 28 -66 c32 -76 61 -95 102 -69 37 25 38 40 5 123 -51 131 -63 188 -69 342 -4 120 -2 166 16 269 27 160 85 333 167 496 l64 130 0 701 0 701 23 43 c27 52 75 80 137 80 25 0 61 -8 80 -19z m-2643 -183 c222 -128 239 -145 231 -229 -4 -37 -12 -58 -33 -79 -34 -35 -86 -54 -126 -46 -42 8 -389 211 -421 246 -38 42 -44 87 -19 144 24 55 83 90 140 82 18 -3 121 -56 228 -118z m-6 -459 c107 -60 204 -122 216 -137 33 -39 39 -84 19 -137 -22 -55 -66 -85 -128 -85 -38 0 -70 15 -238 113 -208 120 -240 148 -240 214 0 53 44 119 90 136 53 19 87 7 281 -104z m3 -464 c102 -59 196 -120 210 -135 52 -62 35 -163 -35 -204 -64 -38 -98 -28 -302 90 -107 61 -201 122 -217 141 -55 62 -33 169 43 207 60 31 99 18 301 -99z" />
                              <path d="M2328 3357 c-32 -15 -126 -96 -282 -244 -129 -123 -238 -223 -242 -223 -4 0 -49 40 -99 89 -99 96 -129 111 -218 111 -159 0 -273 -165 -222 -321 16 -48 37 -74 209 -245 164 -164 198 -193 240 -208 62 -20 110 -20 170 0 39 14 103 69 389 340 188 178 352 342 365 363 55 93 38 206 -42 286 -78 77 -175 96 -268 52z m184 -134 c33 -34 46 -90 29 -131 -13 -31 -636 -627 -684 -654 -75 -42 -110 -22 -310 180 -178 180 -194 207 -167 271 22 54 56 76 115 76 l54 0 114 -112 c84 -83 121 -113 139 -113 19 0 87 59 279 241 140 133 268 250 284 261 43 28 108 20 147 -19z" />
                              <path d="M1540 1180 c-11 -11 -20 -29 -20 -40 0 -11 9 -29 20 -40 19 -19 33 -20 420 -20 387 0 401 1 420 20 11 11 20 29 20 40 0 11 -9 29 -20 40 -19 19 -33 20 -420 20 -387 0 -401 -1 -420 -20z" />
                            </g>
                          </svg>
                        </Col>
                      </Row>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
            <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "cadetblue",
                    borderRadius: "10px",
                    Height: "240px",
                  }}
                  headless
                >
                  <Figure2>
                    <figcaption>
                      <h2>Social Media Management</h2>
                      <p>
                        Manage your social media with premium custom designed
                        creatives
                      </p>
                      <Row
                        style={{
                          justifyContent: "space-between",
                        }}
                      >
                        <Col>
                          <Button size="large" type="white">
                            Contact Support
                          </Button>
                        </Col>
                        <Col>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.0"
                            width="100px"
                            height="100px"
                            style={{ filter: "invert(1)" }}
                            viewBox="0 0 512.000000 512.000000"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g
                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                              fill="#000000"
                              stroke="none"
                            >
                              <path d="M805 5109 c-356 -82 -641 -342 -748 -684 -113 -360 -12 -757 259 -1015 90 -85 155 -131 267 -186 58 -29 76 -42 71 -54 -3 -8 -16 -56 -29 -107 -43 -165 -58 -295 -58 -493 0 -205 15 -325 62 -505 16 -60 28 -111 28 -111 -1 -1 -40 -20 -87 -44 -270 -134 -463 -378 -537 -678 -12 -47 -17 -112 -17 -217 -1 -126 3 -164 23 -240 32 -124 73 -212 106 -227 34 -15 75 -1 95 34 13 25 13 32 -4 75 -100 258 -100 489 3 708 115 246 308 407 572 476 164 43 384 25 543 -46 192 -85 358 -251 442 -442 65 -147 87 -375 50 -526 -63 -264 -233 -473 -478 -586 -129 -60 -201 -75 -358 -75 -110 0 -150 4 -215 22 -108 31 -226 90 -309 157 -79 62 -120 71 -156 33 -44 -48 -22 -89 95 -176 178 -132 416 -202 644 -189 362 21 678 231 841 557 24 47 43 86 44 87 0 1 51 -12 112 -27 311 -80 686 -82 991 -5 53 14 104 27 113 30 14 4 23 -7 41 -52 74 -184 273 -389 474 -490 559 -282 1255 41 1411 655 33 130 35 357 3 482 -74 290 -255 519 -520 655 -52 26 -95 49 -96 49 -1 1 8 41 22 88 91 334 90 744 -5 1072 -11 38 -19 70 -17 71 1 1 40 21 86 44 263 130 454 366 527 650 35 135 35 357 0 493 -85 335 -338 602 -676 714 -82 28 -91 29 -295 29 -204 0 -212 -1 -295 -29 -211 -71 -374 -186 -508 -360 -38 -49 -117 -188 -133 -233 -3 -8 -37 -2 -114 18 -180 47 -300 62 -505 62 -198 0 -328 -15 -493 -58 -51 -13 -99 -26 -107 -29 -11 -5 -25 15 -55 76 -128 265 -369 461 -659 537 -66 17 -108 21 -245 20 -91 -1 -184 -5 -206 -10z m415 -154 c258 -68 478 -257 579 -500 48 -114 64 -196 64 -325 0 -187 -48 -342 -153 -494 -55 -80 -63 -121 -30 -151 26 -24 74 -23 101 1 35 31 99 131 140 218 76 163 109 350 90 518 -6 54 -11 102 -11 107 0 23 244 75 429 92 201 17 456 -8 658 -67 l55 -16 -6 -39 c-54 -335 59 -673 299 -898 226 -211 522 -306 836 -268 l66 8 22 -80 c86 -318 86 -659 -1 -984 l-20 -78 -72 8 c-379 42 -727 -104 -945 -397 -104 -139 -161 -282 -188 -465 -14 -93 -15 -128 -5 -224 6 -63 10 -116 8 -118 -9 -9 -208 -54 -302 -68 -139 -21 -388 -21 -530 0 -95 14 -291 59 -301 69 -2 2 1 51 7 108 32 296 -74 594 -289 809 -223 222 -520 323 -848 286 l-71 -8 -16 55 c-59 201 -84 456 -67 658 17 193 69 428 94 428 7 0 53 -5 102 -11 167 -19 383 20 535 96 93 47 115 92 68 142 -29 31 -48 29 -153 -16 -153 -66 -302 -89 -450 -71 -175 21 -346 100 -475 218 -250 228 -341 579 -234 901 43 129 98 215 209 326 137 137 278 213 457 244 75 14 271 6 348 -14z m3123 -4 c191 -50 374 -180 486 -344 47 -68 106 -200 127 -282 26 -103 24 -303 -4 -410 -137 -512 -699 -782 -1178 -565 -231 104 -409 316 -476 565 -28 108 -30 308 -3 410 69 267 262 492 507 592 160 65 373 79 541 34z m-30 -3106 c299 -61 555 -311 639 -620 33 -123 30 -319 -6 -438 -131 -434 -544 -693 -977 -611 -318 60 -568 290 -665 611 -23 77 -27 106 -27 223 0 159 20 248 82 375 177 359 555 541 954 460z" />
                              <path d="M1082 4564 c-64 -24 -137 -102 -159 -170 -17 -55 -18 -56 -50 -51 -59 10 -137 58 -211 129 -63 62 -75 69 -100 64 -59 -14 -91 -96 -99 -252 -8 -155 26 -252 124 -355 l54 -56 -32 -7 c-18 -3 -63 -9 -101 -13 -77 -7 -98 -24 -98 -79 0 -38 19 -56 95 -90 98 -43 198 -64 304 -64 192 0 329 56 456 184 122 123 176 239 195 423 8 70 15 100 34 128 36 53 67 142 60 171 -8 29 -40 54 -71 54 -13 0 -45 -12 -71 -27 l-48 -27 -50 24 c-62 31 -169 37 -232 14z m186 -164 c45 -32 47 -41 43 -145 -9 -225 -149 -407 -360 -469 -67 -20 -177 -22 -147 -3 45 27 66 56 66 90 0 39 -13 52 -88 92 -106 57 -163 147 -170 269 l-5 79 34 -25 c53 -40 114 -68 196 -89 164 -41 223 -16 223 97 0 118 112 174 208 104z" />
                              <path d="M3067 3330 c-18 -14 -27 -32 -29 -57 -3 -36 -5 -38 -114 -94 -193 -98 -483 -198 -515 -178 -8 5 -104 9 -214 9 -225 0 -250 -6 -292 -69 -22 -33 -23 -41 -23 -275 0 -223 2 -243 20 -274 29 -47 75 -72 137 -72 28 0 54 -3 56 -7 3 -5 10 -120 17 -258 10 -210 14 -254 29 -275 25 -35 82 -39 112 -9 24 24 24 15 2 425 l-6 121 104 5 c89 5 115 2 184 -18 100 -29 116 -30 143 -1 27 29 29 78 4 101 -18 16 -95 44 -179 66 l-43 11 0 183 0 182 97 28 c131 37 270 90 375 142 48 24 92 44 98 44 7 0 10 -135 10 -399 l0 -400 -64 30 c-71 33 -106 32 -131 -4 -38 -54 -12 -92 105 -153 85 -45 90 -49 90 -80 0 -64 71 -96 121 -55 l24 19 3 624 c1 342 0 633 -3 646 -8 32 -41 62 -69 62 -13 0 -35 -9 -49 -20z m-757 -665 l0 -195 -140 0 -140 0 0 195 0 195 140 0 140 0 0 -195z" />
                              <path d="M4189 4696 c-78 -21 -144 -80 -180 -160 -17 -40 -23 -75 -27 -183 l-5 -133 -59 0 c-53 0 -63 -3 -90 -30 -24 -25 -29 -36 -24 -58 11 -46 41 -62 111 -62 l64 0 3 -239 c3 -218 5 -241 22 -260 24 -27 86 -29 109 -3 14 16 17 52 19 258 l3 239 77 5 c88 6 109 19 110 70 1 25 -6 40 -26 57 -23 19 -38 23 -98 23 l-70 0 4 125 c3 105 7 129 24 152 32 44 80 63 157 63 38 0 77 5 88 11 48 25 44 105 -7 128 -32 14 -146 13 -205 -3z" />
                              <path d="M3715 1526 c-38 -16 -102 -87 -112 -123 -5 -16 -8 -194 -8 -398 l0 -370 25 -45 c28 -49 73 -84 129 -100 48 -13 704 -13 752 0 56 16 101 51 129 100 l25 45 0 380 c0 416 1 406 -62 469 -54 55 -60 56 -470 56 -289 -1 -385 -4 -408 -14z m780 -160 c14 -20 15 -69 13 -366 -3 -325 -4 -342 -22 -356 -29 -21 -693 -21 -722 0 -18 14 -19 31 -22 356 -2 297 -1 346 13 366 l15 24 355 0 355 0 15 -24z" />
                              <path d="M4046 1225 c-125 -44 -181 -195 -118 -316 83 -160 311 -160 394 0 96 184 -80 386 -276 316z m129 -160 c70 -69 -30 -170 -102 -103 -14 13 -23 33 -23 50 0 36 40 78 75 78 14 0 37 -11 50 -25z" />
                              <path d="M791 1406 c-49 -27 -50 -39 -51 -379 0 -338 3 -362 49 -387 51 -27 82 -14 361 146 162 93 278 166 288 181 20 32 21 83 0 114 -23 35 -557 339 -594 339 -16 -1 -40 -7 -53 -14z m296 -282 c93 -53 169 -98 171 -99 1 -1 -71 -44 -160 -95 -90 -52 -173 -100 -185 -108 l-23 -14 0 212 c0 183 2 211 15 206 8 -3 90 -49 182 -102z" />
                            </g>
                          </svg>
                        </Col>
                      </Row>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
            <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "#5F63F2",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src={require(`../../static/img/app/analytic.png`)}
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2>Analytics</h2>
                      <p>
                        Track business metrics from anywhere using the Analytics
                        mobile app.
                      </p>
                      <Button size="large" type="white">
                        Coming Soon
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
            <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "rgb(39, 43, 65)",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src={require(`../../static/img/app/inventory.png`)}
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2>Inventory</h2>
                      <p>
                        Create inventories and manage stock in realtime with
                        reorder level alerts.
                      </p>
                      {inventory ? (
                        <span>
                          <Button
                            size="large"
                            type="white"
                            onClick={() => {
                              setItem("inventrory_app_enable", false);
                              setInventory(false);
                            }}
                          >
                            Remove
                          </Button>{" "}
                          <Button
                            size="large"
                            type="white"
                            onClick={() => {
                              setItem("inventrory_app_enable", true);
                              setInventory(true);
                              history.push("/inventory");
                            }}
                          >
                            View
                          </Button>
                        </span>
                      ) : (
                        <Button
                          size="large"
                          type="white"
                          onClick={() => {
                            setItem("inventrory_app_enable", true);
                            setInventory(true);
                            history.push("/inventory");
                          }}
                        >
                          Enable App
                        </Button>
                      )}
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>

            <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "rgb(39, 43, 65)",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src={require(`../../static/img/app/feedback.png`)}
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2>Feedback</h2>
                      <p>
                        Get actionable feedback from your customers and also
                        know their favourite.
                      </p>
                      <Button size="large" type="white">
                        Coming Soon
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
            <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "#7C0000",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src={require(`../../static/img/app/sms.png`)}
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2>SMS Receipts</h2>
                      <p>
                        Acknowledge your customers with an SMS when they shop at
                        your store.
                      </p>
                      <Button size="large" type="white">
                        Coming Soon
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>

            <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "#7C0000",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src={require(`../../static/img//app/more-apps.png`)}
                      // src="https://web.Posease.com/assets/img/more-apps.svg"
                      alt=""
                      height="80px"
                      width="80px"
                    />
                    <figcaption>
                      <h2>More Apps</h2>
                      <p>
                        Apps for integrated payments, accounting, etc are
                        launching shortly.
                      </p>
                      <Button size="large" type="white">
                        Coming Soon
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default Application;
