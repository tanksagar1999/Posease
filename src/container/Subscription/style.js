import Styled from "styled-components";

const PricingCard = Styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 5px 20px #9299B830;
  padding: 30px;
  .pricing-badge{
    height: 32px;
    padding: 6px 22.6px;
  }
  .price-amount{
    font-size: 36px;
    margin-bottom: 10px;
    .currency{
      font-size: 16px;
      font-weight: 600;
      top: -12px;
      ${({ theme }) => (!theme.rtl ? "margin-left" : "margin-right")}: 2px;
      color: ${({ theme }) => theme["extra-light-color"]};
    }
    .pricing-validity{
      font-size: 13px;
      font-weight: 400;
      bottom: 0;
      ${({ theme }) => (!theme.rtl ? "left" : "right")}: -2px;
      color: ${({ theme }) => theme["light-color"]};
    }
  }
  .package-user-type{
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme["gray-color"]};
  }
  .pricing-title{
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  button{
    padding: 0px 29.32px;
    height: 44px;
    border-radius: 6px;
    &.ant-btn-white{
      border: 1px solid #E3E6EF;
      span{
        color: #272b41;
      }
    }
  }
`;

const ListGroup = Styled.div`
  margin: 28px 0 15px;
  min-height: 210px;
  .list-single{
    display: flex;
    align-items: center;
    &:not(:last-child){
      margin-bottom: 12px;
    }
    .icon{
      display: inline-block;
      margin: ${({ theme }) =>
        theme.rtl ? "0px 0 -4px 10px" : "0px 10px -4px 0"};
    }
  }
`;

const Badge = Styled.span`
  display: inline-block;
  margin-bottom: 32px;
  padding: 5px 20px;
  border-radius: 16px;
  background: ${({ type, theme }) => theme[`${type}-color`]}10;
  color: ${({ type, theme }) => theme[`${type}-color`]};
  font-size: 13px;
  font-weight: 500;
`;

const GalleryNav = Styled.nav`
  background: #fff;
  margin-bottom: 25px;
  border-radius: 10px;
  padding: 0px 16px;
  @media only screen and (max-width: 767px){
    padding: 0 12px;
  }
  @media only screen and (max-width: 575px){
    text-align: center;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    li {
      display: inline-block;
      a {
        position: relative;
        display: block;
        padding: 15px 0;
        margin: 0 12px;
        color: ${({ theme }) => theme["light-color"]};
        @media only screen and (max-width: 767px){
          margin: 0 10px;
        }
        &:after{
          position: absolute;
          ${({ theme }) => (!theme.rtl ? "left" : "right")}: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          border-radius: 10px;
          opacity: 0;
          visibility: hidden;
          background: ${({ theme }) => theme["primary-color"]};
          content: "";
        }
        &.active{
          color: ${({ theme }) => theme["primary-color"]};
          &:after{
            opacity: 1;
            visibility: visible;
          }
        }
      }
    }
  }
`;

const GalleryCard = Styled.nav`
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 5px 20px ${({ theme }) => theme["light-color"]}03;
  figure{
    margin-bottom: 0;
  }
  .gallery-single-content{
    padding: 18px 25px 20px;
    .gallery-single-title{
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 2px;
    }
    p{
      font-size: 13px;
      margin-bottom: 0px;
      color: ${({ theme }) => theme["light-color"]};
    }
  }
`;

const UsercardWrapper = Styled.nav`
  .user-card-pagination{
    margin: 15px 0 40px 0;
    text-align: ${({ theme }) => (!theme.rtl ? "right" : "left")};
    @media only screen and (max-width: 991px){
      text-align: center;
    }
  }
`;

const UserTableStyleWrapper = Styled.nav`
  table{
    tbody{
      td{
        .user-info{
          .user-name{
            font-size: 14px;
          }
        }
        span.status-text{
          font-size: 12px;
          padding: 0 12.41px;
          line-height: 1.9;
          font-weight: 500;
          border-radius: 12px;
          text-transform: capitalize;
          display: inline-block !important;
          background: #ddd;
          &.active{
            background-color: ${({ theme }) => theme["success-color"]}15;
            color: ${({ theme }) => theme["success-color"]};
          }
          &.deactivate{
            background-color: ${({ theme }) => theme["warning-color"]}15;
            color: ${({ theme }) => theme["warning-color"]};
          }
          &.blocked{
            background-color: ${({ theme }) => theme["danger-color"]}15;
            color: ${({ theme }) => theme["danger-color"]};
          }
        }
      }
    }
  }
  .ant-table-pagination.ant-pagination{
    width: 100%;
    text-align: ${({ theme }) => (!theme.rtl ? "right" : "left")};
    // border-top: 1px solid ${({ theme }) => theme["border-color-light"]};
    margin-top: 0 !important;
    padding-top: 10px;
    @media only screen and (max-width: 767px){
      text-align: center;
    }
  }
  .contact-table{
    table{
      tr{
        th{
          &:first-child{
            ${({ theme }) =>
              theme.rtl ? "padding-right" : "padding-left"}: 20px;
          }
          &:last-child{
            ${({ theme }) =>
              theme.rtl ? "padding-left" : "padding-right"}: 20px;
          }
        }
      }
      .table-actions{
        button{
          width: auto;
          height: auto;
          padding: 0;
          background-color: transparent;
          &:hover{
            background-color: transparent;
          }
          &.ant-btn-primary{
            &:hover{
              color: #ADB4D2;
            }
          }
        }
      }
      tbody >tr.ant-table-row-selected >td{
        background-color: ${({ theme }) => theme["primary-color"]}10;
      }
    }
  }
`;

const UserCard = Styled.div`
  text-align: center;
  .card{
    position: relative;
    box-shadow: 0 5px 20px ${({ theme }) => theme["light-color"]}03;
    .ant-card-body{
      padding: 30px !important;
      div{
        position: static;
      }
    }
    figure{
      margin-bottom: 0;
      img{
        margin-bottom: 20px;
        width: 100%;
        border-radius: 50%;
        max-width: 150px;
      }
    }
    .card__more_actions{
      position: absolute;
      ${({ theme }) => (theme.rtl ? "left" : "right")}: 24px;
      top: 20px;
      line-height: .5;
      padding: 5px 3px;
      color: ${({ theme }) => theme["extra-light-color"]};
      box-shadow: 0 10px 20px #9299B815;
      svg,
      img{
        width: 20px;
      }
    }
    .card__name{
      font-size: 16px;
      margin-bottom: 6px;
      font-weight: 500;
      a{
        color: ${({ theme }) => theme["dark-color"]};
        &:hover{
          color: ${({ theme }) => theme["primary-color"]};
        }
      }
    }
    .card__designation{
      font-size: 13px;
      margin-bottom: 25px;
      color: ${({ theme }) => theme["light-color"]};
    }
    .card__social{
      margin-top: 16px;
      a{
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px ${({ theme }) => theme["light-color"]}15;
        background: #fff;
        &:not(:last-child){
          ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 10px;
        }
        &.facebook span.fa{
          color: #3B5998;
        }
        &.twitter span.fa{
          color: #1DA1F2;
        }
        &.dribble span.fa{
          color: #C2185B;
        }
        &.instagram span.fa{
          color: #FF0300;
        }
      }
    }
  }

  .user-card{
    .ant-card-body{
      padding: 30px 25px 18px 25px !important;
      @media only screen and (max-width: 1599px){
        padding: 20px  20px 20px !important;
      }
      @media only screen and (max-width: 767px){
        padding: 15px  15px 15px !important;
      }
    }
    figure{
      img{
        margin-bottom: 18px;
        max-width: 120px;
      }
    }
    .card__actions{
      margin: -5px;
      .ant-btn-white{
        color: ${({ theme }) => theme["gray-color"]};
        border: 1px solid ${({ theme }) => theme["border-color-light"]};
        &:hover{
          border: 1px solid ${({ theme }) => theme["primary-color"]};
        }
      }
      button{
        font-size: 13px;
        padding: 0px 22.7px;
        height: 38px;
        border-radius: 6px;
        box-shadow: 0px 3px 5px ${({ theme }) => theme["light-color"]}05;
        margin: 5px;
        &:hover{
          color: #fff !important;
          background-color: ${({ theme }) => theme["primary-color"]} !important;
          svg,
          i{
            color: #fff;
          }
        }
        svg,
        i{
          color: ${({ theme }) => theme["light-color"]};
        }
      }
    }
    .card__info{
      padding-top: 20px;
      margin-top: 18px;
      border-top: 1px solid ${({ theme }) => theme["border-color-light"]};
      .info-single{
        text-align: center;
      }
      .info-single__title{
        font-size: 16px;
        font-weight: 600;
        line-height: 1.5;
        margin-bottom: 4px;
      }
      p{
        margin-bottom: 0;
        color: ${({ theme }) => theme["light-color"]};
      }
    }
  }
`;

const FaqCategoryBox = Styled.div`
  .faq-badge{
    font-weight: 400;
    color: ${({ theme }) => theme["light-color"]};
    background: ${({ theme }) => theme["bg-color-light"]};
  }
  ul{
    li{
      a{
        display: inline-block;
        font-weight: 500;
        position: relative;
        padding: ${({ theme }) =>
          !theme.rtl ? "12px 0 12px 20px" : "12px 20px 12px 0"};
        transition: all .3s ease;
        color: ${({ theme }) => theme["gray-color"]};
        &.active{
          padding-left: 28px;
          &:before{
            opacity: 1;
            visibility: visible;
            ${({ theme }) => (!theme.rtl ? "left" : "right")}: -15px;
          }
          &:after{
            ${({ theme }) => (!theme.rtl ? "left" : "right")}: 5px;
          }
          &.primary{
            &:after{
              background: ${({ theme }) => theme["primary-color"]};
            }
          }
          &.secondary{
            &:after{
              background: ${({ theme }) => theme["secondary-color"]};
            }
          }
          &.success{
            &:after{
              background: ${({ theme }) => theme["success-color"]};
            }
          }
          &.warning{
            &:after{
              background: ${({ theme }) => theme["warning-color"]};
            }
          }
          &.info{
            &:after{
              background: ${({ theme }) => theme["info-color"]};
            }
          }
          &.danger{
            &:after{
              background: ${({ theme }) => theme["danger-color"]}5;
            }
          }
        }
        &:before{
          position: absolute;
          ${({ theme }) => (!theme.rtl ? "left" : "right")}: -25px;
          top: 0;
          height: 100%;
          width: 2px;
          border-radius: 10px;
          opacity: 0;
          visibility: hidden;
          content: '';
          background: ${({ theme }) => theme["primary-color"]};
          transition: all .3s ease;
        }
        &:after{
          position: absolute;
          ${({ theme }) => (!theme.rtl ? "left" : "right")}: 0;
          top: 50%;
          transform: translatey(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          content: '';
          background: ${({ theme }) => theme["primary-color"]}50;
          transition: all .3s ease;
        }
        &.secondary{
          &:after{
            background: ${({ theme }) => theme["secondary-color"]}50;
          }
          &:before{
            background: ${({ theme }) => theme["secondary-color"]};
          }
        }
        &.success{
          &:after{
            background: ${({ theme }) => theme["success-color"]}50;
          }
          &:before{
            background: ${({ theme }) => theme["success-color"]};
          }
        }
        &.warning{
          &:after{
            background: ${({ theme }) => theme["warning-color"]}50;
          }
          &:before{
            background: ${({ theme }) => theme["warning-color"]};
          }
        }
        &.info{
          &:after{
            background: ${({ theme }) => theme["info-color"]}50;
          }
          &:before{
            background: ${({ theme }) => theme["info-color"]};
          }
        }
        &.danger{
          &:after{
            background: ${({ theme }) => theme["danger-color"]}50;
          }
          &:before{
            background: ${({ theme }) => theme["danger-color"]};
          }
        }
      }
    }
  }
`;

const FaqSupportBox = Styled.div`
  text-align: center;
  .ant-card-body{
    padding: 30px 50px 40px 50px !important;
    @media only screen and (max-width: 1599px){
      padding: 30px !important;
    }
    @media only screen and (max-width: 991px){
      padding: 25px !important;
    }
  }
  figure{
    margin-bottom: 30px;
    img{
      width: 100%;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 20px;
    color: ${({ theme }) => theme["dark-color"]};
  }
  button{
    padding: 0 30px;
    border-radius: 6px;
    height: 44px;
  }
`;

const FaqWrapper = Styled.div`
  .ant-card{
    .ant-card-body{
      h1{
        font-weight: 500;
      }
    }
  }
  .ant-collapse{
    margin-top: 25px;
    &.ant-collapse-borderless{
      background: #fff;
    }
    &.ant-collapse-icon-position-left{
      .ant-collapse-header{
        color: ${({ theme }) => theme["dark-color"]} !important;
      }
    }
  }
  .ant-collapse-item{
    border: 1px solid ${({ theme }) => theme["border-color-light"]} !important;
    &.ant-collapse-item-active{
      box-shadow: 0px 15px 40px ${({ theme }) => theme["light-color"]}15;
    }
    .ant-collapse-header{
      font-weight: 500;
      font-size: 15px;
      background-color: #fff;
      padding: 18px 25px !important;
      border-radius: 5px !important;
      @media only screen and (max-width: 575px){        
        padding: ${({ theme }) =>
          !theme.rtl
            ? "15px 45px 15px 15px"
            : "15px 15px 15px 45px"} !important;
      }
      .ant-collapse-arrow{
        ${({ theme }) => (!theme.rtl ? "left" : "right")}: auto !important;
        ${({ theme }) => (theme.rtl ? "left" : "right")}: 25px !important;
        top: 22px !important;
        transform: translateY(0) !important;
      }
    }
  }

  .ant-collapse-content{
    box-shadow: 0 15px 40px ${({ theme }) => theme["light-color"]}15;
    .ant-collapse-content-box{
      border-top: 1px solid ${({ theme }) =>
        theme["border-color-light"]} !important;
      padding: 20px 25px 30px !important;
      P{
        font-size: 15px;
        margin-bottom: 35px;
        line-height: 1.667;
        color: ${({ theme }) => theme["gray-color"]};
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6{
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 12px;
        color: ${({ theme }) => theme["dark-color"]};
      }
      .panel-actions{
        button{
          height: 36px;
          padding: 0 15px;
          &:not(:last-child){
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 10px;
          }
        }
      }
    }
  }
`;

const SearchResultWrapper = Styled.div`
  .ant-select{
    @media only screen and (max-width: 575px){
      width: 100% !important;
    }
  }
  .ant-select-selector{
    height: 48px !important;
    .ant-select-selection-search{
      height: 48px;
      width: 100% !important;
      input{
        height: 46px !important;
      }
    }
    .ant-input-affix-wrapper{
      border: 0 none;
    }
    .ant-select-selection-search-input {
      border-radius: 100px;
    }
  }
  .search-filter-menu{
    margin: 22px 0 20px;
    @media only screen and (max-width: 575px){
      text-align: center;
    }
    ul{
      li{
        display: inline-block;
        margin-bottom: 10px;
        &:not(:last-child){
          ${({ theme }) => (!theme.rtl ? "margin-right" : "margin-left")}: 10px;
        }
        a{
          font-size: 13px;
          font-weight: 500;
          display: block;
          padding: 5px 15px;
          border-radius: 5px;
          color: ${({ theme }) => theme["light-color"]};
          box-shadow: 0 3px 6px ${({ theme }) => theme["light-color"]}05;
          background: #fff;
          &.active{
            color: #fff;
            background: ${({ theme }) => theme["primary-color"]};
          }
        }
      }
    }
  }
`;

const ResultList = Styled.div`
  .result-list-top{
    max-width: 1000px;
    border-bottom: 1px solid ${({ theme }) => theme["border-color-light"]};
    margin-bottom: 20px;
    padding-bottom: 24px;
  }
  .search-found-text{
    font-size: 16px;
    margin-bottom: 0;
    color: ${({ theme }) => theme["light-color"]};
    .result-count{
      ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 5px;
    }
    .result-keyword{
      ${({ theme }) => (!theme.rtl ? "margin-left" : "margin-right")}: 4px;
    }
    .result-count,
    .result-keyword{
      font-weight: 600;
      color: ${({ theme }) => theme["dark-color"]};
    }
  }
  .result-limit{
    text-align: ${({ theme }) => (!theme.rtl ? "right" : "left")};
    margin-bottom: 0;
    color: ${({ theme }) => theme["light-color"]};
    @media only screen and (max-width: 767px){
      text-align: ${({ theme }) => (theme.rtl ? "right" : "left")};
      margin-top: 10px;
    }
  }
  .result-list-content{
    border-bottom: 1px solid ${({ theme }) => theme["border-color-light"]};
    padding-bottom: 14px;
    margin-bottom: 30px;
    ul{
      li{
        &:not(:last-child){
          margin-bottom: 35px;
        }
        .result-list-title{
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 10px;
          .search-keyword{
            font-weight: 600;
            color: ${({ theme }) => theme["primary-color"]};
          }
        }
        p{
          color: ${({ theme }) => theme["gray-color"]};
        }
      }
    }
  }
  .ant-pagination{
    @media only screen and (max-width: 575px){
      text-align: center;
    }
  }
`;

const MaintananceWrapper = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  img{
    margin-bottom: 72px;
    max-width: 400px;
    width: 100%;
    @media only screen and (max-width: 575px){
      margin-bottom: 30px;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 15px;
  }
  p{
    color: ${({ theme }) => theme["gray-color"]};
  }
`;

const ErrorWrapper = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  img{
    margin-bottom: 100px;
    max-width: 400px;
    width: 100%;
    @media only screen and (max-width: 575px){
      margin-bottom: 30px;
    }
  }
  .error-text{
    font-size: 60px;
    font-weight: 600;
    margin-bottom: 35px;
    color: ${({ theme }) => theme["extra-light-color"]};
  }
  p{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 26px;
  }
  button{
    height: 44px;
  }
`;

const ComingsoonStyleWrapper = Styled.div`
  text-align: center;
  background: #fff;
  padding: 75px 0 30px;
  margin-bottom: 30px;
  @media only screen and (max-width: 1150px){
    padding: 50px 0 6px;
  }
  @media only screen and (max-width: 991px){
    padding: 20px 0 0px;
  }
  .strikingDash-logo{
    margin-bottom: 55px;
    @media only screen and (max-width: 1150px){
      margin-bottom: 30px;
    }
    @media only screen and (max-width: 767px){
      margin-bottom: 25px;
    }
    img{
      max-width: 170px;
    }
  }
  .coming-soon-content{
    h1{
      font-size: 58px;
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: 25px;
      color: ${({ theme }) => theme["dark-color"]};
      @media only screen and (max-width: 991px){
        font-size: 48px;
        margin-bottom: 15px;
      }
      @media only screen and (max-width: 767px){
        font-size: 40px;
        line-height: 1.45;
      }
      @media only screen and (max-width: 479px){
        font-size: 30px;
      }
      @media only screen and (max-width: 375px){
        font-size: 20px;
      }
    }
    p{
      font-size: 17px;
      max-width: 580px;
      margin: 0 auto 25px;
      color: ${({ theme }) => theme["gray-color"]};
      @media only screen and (max-width: 991px){
        margin-bottom: 15px;
      }
      @media only screen and (max-width: 767px){
        font-size: 16px;
      }
      @media only screen and (max-width: 375px){
        font-size: 15px;
      }
    }
  }
  .countdwon-data{
    display: flex;
    justify-content: center;
    >span{
      &:not(:last-child){
        margin-right: 50px;
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 50px;
        @media only screen and (max-width: 575px){
          margin-right: 20px;
          ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 20px;
        }
      }
    }
  }
  .strikingDash-countdown{
    .countdown-time{
      font-size: 42px;
      font-weight: 600;
      line-height: 1.45;
      color: ${({ theme }) => theme["dark-color"]};
      @media only screen and (max-width: 991px){
        font-size: 32px;
      }
      @media only screen and (max-width: 575px){
        font-size: 26px;
      }
      @media only screen and (max-width: 375px){
        font-size: 20px;
      }
    }
    .countdown-title{
      font-size: 16px;
      font-weight: 400;
      display: block;
      color: ${({ theme }) => theme["gray-color"]};
      @media only screen and (max-width: 375px){
        font-size: 15px;
      }
    }
  }
  .subscription-form{
    margin-top: 40px;
    @media only screen and (max-width: 991px){
      margin-top: 25px;
    }
    @media only screen and (max-width: 1150px){
      margin-top: 35px;
    }
    .subscription-form-inner{
      display: flex;
      justify-content: center;
      @media only screen and (max-width: 375px){
        flex-flow: column;
        margin-bottom: 20px;
      }
      .ant-form-item-control-input{
        margin-right: 20px;
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 20px;
        @media only screen and (max-width: 375px){
          margin-right: 0;
          ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 0;
        }
        .ant-input{
          min-width: 320px;
          padding: 12px 20px;
          @media only screen and (max-width: 767px){
            min-width: 100%;
          }
          &::placeholder{
            color: ${({ theme }) => theme["extra-light-color"]};
          }
        }
      }
      button{
        font-size: 14px;
        text-transform: uppercase;
        font-weight: 500;
      }
    }
  }
  .coming-soon-social{
    margin-top: 50px;
    @media only screen and (max-width: 1150px){
      margin-top: 25px;
    }
    @media only screen and (max-width: 767px){
      margin-top: 30px;
    }
    ul{
      margin-bottom: 30px;
      li{
        display: inline-block;
        &:not(:last-child){
          margin-right: 15px;
          ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 15px;
        }
        a{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          i,
          span,
          svg{
            color: #fff;
          }
          &.facebook{
            background-color: #3B5998;
          }
          &.twitter{
            background-color: #1DA1F2;
          }
          &.globe{
            background-color: #DD3E7C;
          }
          &.github{
            background-color: #23282D;
          }
        }
      }
    }
    p{
      font-size: 14px;
      color: ${({ theme }) => theme["light-color"]};
    }
  }
`;

const AddUser = Styled.div`
  .form-title{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 36px;
  }
  .add-user-wrap{
   $: 
  }
  .add-user-bottom{
    margin-top: 20px;
    button + button{
      ${({ theme }) => (!theme.rtl ? "margin-left" : "margin-right")}: 15px;
    }
    .ant-btn-light{
      background: ${({ theme }) => theme["bg-color-light"]};
      border: 1px solid #F1F2F6;
    }
    &.text-right{
      @media only screen and (max-width: 767px){
        text-align: ${({ theme }) =>
          !theme.rtl ? "left" : "right"} !important;
      }
    }
  }
  .card-nav{
    ul{
      flex-wrap: wrap;
      margin-bottom: -4px -10px;
      @media only screen and (max-width: 575px){
        justify-content: center;
      }
      li{
        margin: 4px 10px !important;
        &:not(:last-child){
          ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 26px;
          @media only screen and (max-width: 575px){
            ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 0;
          }
        }
        a{
          position: relative;
          padding: 22px 0;
          font-size: 14px;
          font-weight: 500;
          color: ${({ theme }) => theme["gray-color"]};
          @media only screen and (max-width: 575px){
            padding: 0;
          }
          &:after{
            position: absolute;
            ${({ theme }) => (!theme.rtl ? "left" : "right")}: 0;
            bottom: -4px;
            width: 100%;
            height: 2px;
            border-radius: 4px;
            content: '';
            opacity: 0;
            visibility: hidden;
            background-color: ${({ theme }) => theme["primary-color"]};
            @media only screen and (max-width: 575px){
              display: none;
            }
          }
          &.active{
            color: ${({ theme }) => theme["primary-color"]};
            &:after{
              opacity: 1;
              visibility: visible;
            }
            svg,
            img,
            i,
            span{
              color: ${({ theme }) => theme["primary-color"]};
            }
          }
          svg,
          img,
          i,
          span{
            color: ${({ theme }) => theme["light-color"]};
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 10px;
          }
        }
      }
    }
  }

  /* // Photo Upload */
  .photo-upload{
    position: relative;
    max-width: 260px;
    margin-bottom: 30px;
    .ant-upload-select{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      position: absolute;
      ${({ theme }) => (!theme.rtl ? "left" : "right")}: 85px;
      bottom: 5px;
      z-index: 10;
      background-color: ${({ theme }) => theme["white-color"]};
      span{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        z-index: -1;
        background-color: ${({ theme }) => theme["primary-color"]};
      }
      svg,
      i,
      span{
        color: ${({ theme }) => theme["white-color"]};
      }
      a{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    img{
      border-radius: 50%;
    }
    .info{
      background-color: transparent;
    }
    figcaption{
      ${({ theme }) => (theme.rtl ? "margin-right" : "margin-left")}: 20px;
      .info{
        h1,
        h2,
        h3,
        h4,
        h5,
        h6{
          font-size: 15px;
          font-weight: 500;
        }
      }
    }
  }

  .user-work-form{
    .ant-picker{
      padding: 0 15px 0 0;
    }
  }
  .user-info-form{
    .ant-select-single .ant-select-selector .ant-select-selection-item{
      color: ${({ theme }) => theme["gray-color"]};
    }
  }
  .social-form{
    .ant-form-item-control-input-content{
      .ant-input-prefix{
        width: 44px;
        height: 44px;
        border-radius: 4px;
      }
    }
    .ant-form-item-control-input{
      height: 44px;
      .ant-input-affix-wrapper{
        &:hover,
        &:focus,
        &.ant-input-affix-wrapper-focused{
          border-color: #E3E6EF;
        }
        .ant-input{
          height: 42px;
          ${({ theme }) => (!theme.rtl ? "padding-left" : "padding-right")}: 0;
        }
      }
    }
    .ant-input-prefix{
      position: relative;
      ${({ theme }) => (!theme.rtl ? "left" : "right")}: -11px;
      span{
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        width: 100%;
        height: 100%;
        background-color: ${({ theme }) => theme["primary-color"]};
        i,
        svg,
        span.fa{
          color: #fff;
          font-size: 16px;
        }
        .fa-facebook{
          background-color: #3B5998;
        }
        .fa-twitter{
          background-color: #38B8FF;
        }
        .fa-linkedin{
          background-color: #2CAAE1;
        }
        .fa-instagram{
          background-color: #FF0300;
        }
        .fa-github{
          background-color: #292929;
        }
        .fa-youtube{
          background-color: #FE0909;
        }
      }
    }
  }
`;
const ChangelogWrapper = Styled.div`
   .ant-card-head{
     .ant-card-head-title{
       .v-num{
        $: 0;
         font-size: 18px;
         color: ${({ theme }) => theme["dark-color"]};
       }
       .sign{
         font-size: 18px;
         color: ${({ theme }) => theme["dark-color"]};
         display: inline-block;
         margin: 0 8px;
       }
       .rl-date{
        $: 0;
         font-weight: 400;
         font-size: 16px;
       }
     }
   }
  .version-list{
    .version-list__single{
      &:not(:last-child){
        margin-bottom: 30px;
      }
      ul{
        li{
          position: relative;
          ${({ theme }) =>
            theme.rtl ? "padding-right" : "padding-left"}: 20px;
          font-size: 16px;
          color: ${({ theme }) => theme["gray-color"]};
          &:not(:last-child){
            margin-bottom: 12px;
          }
          &:after{
            position: absolute;
            ${({ theme }) => (theme.rtl ? "right" : "left")}: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            content: "";
          }
        }
        &.version-primary{
          li{
            &:after{
              background-color: ${({ theme }) => theme["primary-color"]};
            }
          }
        }
        &.version-success{
          li{
            &:after{
              background-color: ${({ theme }) => theme["success-color"]};
            }
          }
        }
        &.version-info{
          li{
            &:after{
              background-color: ${({ theme }) => theme["info-color"]};
            }
          }
        }
      }
    }
    .version-list__top{
      .badge{
        font-size: 12px;
        line-height: 1.2;
        letter-spacing: 1.4px;
        font-weight: 500;
        display: inline-block;
        padding: 5px 8px;
        height: auto;
        border-radius: 4px;
        margin-bottom: 14px;
        color: #fff;
        &.badge-primary{
          background-color: ${({ theme }) => theme["primary-color"]};
        }
        &.badge-info{
          background-color: ${({ theme }) => theme["info-color"]};
        }
        &.badge-success{
          background-color: ${({ theme }) => theme["success-color"]};
        }
      }
    }
  }

  .changelog-accordion{
    margin-top: 30px;
    .ant-collapse{
      background-color: transparent;
      border: 0 none;
    }
    .ant-collapse-item{
      border-radius: 6px;
      border: 1px solid ${({ theme }) => theme["border-color-normal"]};
      &:not(:last-child){
        margin-bottom: 20px;
      }
      &:last-child{
        border-radius: 6px;
        .ant-collapse-header{
          border-radius: 6px;
        }
      }
    }
    .ant-collapse-header{
      border-radius: 6px;
      padding: 20px 30px 18px 30px !important;
      @media only screen and (max-width: 575px){
        padding: 16px 20px 14px 20px !important;
      }
      .ant-collapse-arrow{
        left: auto !important;
        right: 30px;
        svg,
        img{
          width: 14px;
        }
      }
      .v-num{
        font-size: 18px;
        font-weight: 500;
        color: ${({ theme }) => theme["dark-color"]};
        @media only screen and (max-width: 575px){
          font-size: 16px;
        }
      }
      .rl-date{
        font-size: 16px;
        font-weight: 400;
        @media only screen and (max-width: 575px){
          font-size: 14px;
        }
      }
    }
    .ant-collapse-content{
      border-radius: 0 0 6px 6px;
      > .ant-collapse-content-box{
        padding: 30px 30px 25px;
      }
    }
  }
`;
const VersionHistoryList = Styled.div`
  .history-title{
    font-size: 11px;
    margin-bottom: 24px;
    color: ${({ theme }) => theme["light-gray-color"]};
  }
  .v-history-list{
    li{
      display: flex;
      justify-content: space-between;
      &:not(:last-child){
        margin-bottom: 24px;
      }
      .version-name{
        font-size: 14px;
        font-weight: 500;
        color: ${({ theme }) => theme["dark-color"]};
      }
      .version-date{
        font-size: 14px;
        color: ${({ theme }) => theme["light-gray-color"]};
      }
    }
  }
`;

export {
  PricingCard,
  ListGroup,
  Badge,
  GalleryNav,
  UserCard,
  GalleryCard,
  UsercardWrapper,
  UserTableStyleWrapper,
  FaqCategoryBox,
  FaqSupportBox,
  FaqWrapper,
  SearchResultWrapper,
  ResultList,
  MaintananceWrapper,
  ErrorWrapper,
  ComingsoonStyleWrapper,
  AddUser,
  ChangelogWrapper,
  VersionHistoryList,
};
