import React from "react";
import styled from "styled-components";

// props로 onSwipe 함수를 불러옴
const SwipeItem = React.memo(({ onSwipe }) => {
  const swipe_div = React.useRef(null);

  let target_classname = "";

  // 마우스를 누르고 있는 상태에서만 mousemove 이벤트가 발생하게 함
  let clicked = false;
  let coordinate = {
    start_x: 0,
    start_y: 0,
    end_x: 0,
    end_y: 0,
  };

  React.useEffect(() => {

    // 위치 초기화!
    const reset = () => {
      // 좌표 초기화
      coordinate = {
        start_x: 0,
        start_y: 0,
        end_x: 0,
        end_y: 0,
      };

      // 원래 클래스로 지정
      swipe_div.current.className = target_classname;
      clicked = false;
      // 원래 위치로 되돌림
      swipe_div.current.style.left = 0 + "px";
      swipe_div.current.style.top = 0 + "px";
    };

    // 마우스 누를 때
    const mouseDown = (e) => {

      // 마우스를 누르고 있을 때만 true
      clicked = true;

      // 원래 classname 저장!
      target_classname = swipe_div.current.className;

      // 마우스를 누른  좌표를 기록!
      // (중요! 그래야 터치 종료할 때 위치를 보고 왼쪽인지, 오른쪽인지 판별할 수 있겠죠!)
      coordinate = {
        ...coordinate,
        start_x: e.clientX,
        start_y: e.clientY,
      };

    };

    // 마우스를 땠을 때
    const mouseUp = (e) => {

      // 마우스를 때서 드래그가 끝났으므로 false!
      clicked = false;

      coordinate = {
        ...coordinate,
        end_x: e.clientX,
        end_y: e.clientY
      };

      
      //  x좌표의 차(이동거리)
      let diff_x = coordinate.end_x - coordinate.start_x;
      //  스와이프 방향
      let direct = null;

      // x좌표(좌우) 이동거리가 너무 작으면 움직이지 않은거로 간주하고 원상태로 돌림
      if (Math.abs(diff_x) > 100) {
        // swiper가 서서히 사라지게 하기 위해 클래스 추가
        swipe_div.current.className = target_classname + " swipe";

        // 좌표의 차가 양수이면 direct는 right
        // 움직인 방향에 따라 더 옴직이고 투명도를 0으로 (점점 사라지게) 줘봐요!
        if (diff_x > 0) {
          console.log('move right');
          direct = "right";
          swipe_div.current.style.left = diff_x + 150 + "px";
          swipe_div.current.style.opacity = 0;
        } else {
          direct = "left";
          console.log('move left');
          swipe_div.current.style.left = diff_x - 150 + "px";
          swipe_div.current.style.opacity = 0;
        }
      }
      // 좌우로 일정이상 움직이지 않으면 원래 위치로 되돌림!
      else{
        reset();
      }  
      
    }




    const mouseMove = (e) => {

      // 스와이프 중 다른 이벤트가 발생하는 것을 막아줍니다
      e.preventDefault();

      // 마우스가 눌린 상태에만 swiper가 이동하게 함!
      if (clicked === true) {

        // 현재 좌표(이동 중인 좌표)를 기록.
        let current_coordinate = {
          x: e.clientX,
          y: e.clientY,
        };

        // 시작 좌표와 이동중인 좌표의 차이를 swiper의 처음 위치의 top, left로 줘서 
        // 마우스를 누르고 있을 때 따라 움직이게 한다! 
        swipe_div.current.style.left =
          current_coordinate.x - coordinate.start_x + "px";
        swipe_div.current.style.top =
          current_coordinate.y - coordinate.start_y + "px";
      }

    };

    // 드래그를 너무 빨리해서 swiper 밖으로 커서가 나가면 위치 초기화
    const mouseLeave = (e) => {
      reset();
    }

    // 이벤트 추가
    swipe_div.current.addEventListener("mousedown", mouseDown);
    swipe_div.current.addEventListener("mouseup", mouseUp);
    swipe_div.current.addEventListener("mousemove", mouseMove);
    swipe_div.current.addEventListener("mouseleave", mouseLeave);
    // 이부분은 이벤트 해제 부분!
    return () => {
      // 만약 이벤트 걸었던 엘리먼트가 없으면 해제하지 않는다!
      if (!swipe_div.current) {
        return;
      }
      swipe_div.current.removeEventListener("mousedown", mouseDown);
      swipe_div.current.removeEventListener("mouseup", mouseUp);
      swipe_div.current.removeEventListener("mousemove", mouseMove);
      swipe_div.current.removeEventListener("mousemove", mouseLeave);
    };
  }, []);

  return (
    <DragItem>
      <div ref={swipe_div}>
          {/*이 안에 이미지를 넣어도 됨!*/}
      </div>
    </DragItem>
  );

});


// 움직이는 요소의 position을 지정해주지 않으면 top, left 속성이 먹지 않음!!
const DragItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  & div{
    min-width: 150px;
    min-height: 150px;
    background-color: blue;
    position: relative;
    &.swipe {
      transition: 300ms;
    }
  }  

`;


// 기본 함수
SwipeItem.defaultProps = {
  onSwipe: (direction) => { },
};

export default SwipeItem;