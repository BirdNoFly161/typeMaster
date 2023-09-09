import React, {useState, useEffect, useContext, useCallback, useRef} from "react";
import { PracticePageContext } from "./PracticePageContext.jsx";
// svg assets
import Backspace from '../../assets/special_keys_icons/Backspace.svg'
import CapsLock from '../../assets/special_keys_icons/CapsLock.svg'
import ControlLeft from '../../assets/special_keys_icons/ControlLeft.svg'
import ControlRight from '../../assets/special_keys_icons/ControlRight.svg'
import Enter from '../../assets/special_keys_icons/Enter.svg'
import MetaLeft from '../../assets/special_keys_icons/MetaLeft.svg'
import ShiftLeft from '../../assets/special_keys_icons/ShiftLeft.svg'
import ShiftRight from '../../assets/special_keys_icons/ShiftRight.svg'
import Space from '../../assets/special_keys_icons/Space.svg'
import Tab from '../../assets/special_keys_icons/Tab.svg'
import AltLeft from '../../assets/special_keys_icons/AltLeft.svg'
import AltRight from '../../assets/special_keys_icons/AltRight.svg'

// style
import '../styles/keyboard.css'
import moveKeyById from "../controllers/moveKeyById.js";

const Key = (props) => {

    const [isDown, setIsDown] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)

    const special_keys = window.keyboard_layouts.ISO["special_keys_first"].flat(1)
                   .concat(window.keyboard_layouts.ISO["special_keys_last"]).flat(1)
                   .concat(window.keyboard_layouts.ISO["last_row"])

    
    const special_keys_icons={
        "AltLeft" : AltLeft,
        "AltRight" : AltRight,
        "Backspace" : Backspace,
        "CapsLock" : CapsLock,
        "ControlLeft" : ControlLeft,
        "ControlRight" : ControlRight,
        "Enter" : Enter,
        "MetaLeft" : MetaLeft,
        "ShiftLeft" : ShiftLeft,
        "ShiftRight" : ShiftRight,
        "Space" : Space,
        "Tab" : Tab,
    }

    const 
    {
        possible_chars, generatedChar, setGeneratedChar, setLastKeyPressIsCorrect,
        numberKeyPresses, setNumberKeyPresses, numberCorrectKeyPresses, setNumberCorrectKeyPresses,
        key_set, setKeySet,shiftIsDown, setShiftIsDown, last_position, setLastPosition,

        LeftIndexTimeRef,RightIndexTimeRef,LeftMiddleTimeRef,
        RightMiddleTimeRef,LeftRingTimeRef,RightRingTimeRef,
        LeftPinkyTimeRef,RightPinkyTimeRef,LeftThumbTimeRef,
        RightThumbTimeRef,

        original_positions
        }= useContext(PracticePageContext)

    

    // return finger thats assigned to the key
    const assigned_finger = (keychar) =>{

    for (const [key, assigned_characters] of Object.entries(window.keyboard_layouts.ISO["finger_mapping"])){
        if(assigned_characters.includes(keychar)){
            return key;
        }
    }
}

    var finger_reset_timeout_id = null
    const finger_reset_timeout_idRef = useRef(0)

    const handleKeyDown= (event)=>{
        if(event.repeat){return}
        if(event.code ==='ShiftLeft' || event.code === 'ShiftRight'){
            setKeySet(window.iso_qwerty.rows_alt)
        }
        if(event.key === props.keychar || event.code === props.keychar){
            //console.log('event down localy recognized with key = ', props.keychar)
            setNumberKeyPresses((numberKeyPresses)=>numberKeyPresses+=1)
            if(! isDown){
                console.log('assigned finger: ',assigned_finger(props.keychar))
                let assigned_finger_v = assigned_finger(props.keychar)
                setLastPosition((last_position)=> {
                    return ({...last_position, ...{[assigned_finger_v]: props.keychar }})})
                setIsDown((isDown) => true)
                if(props.keychar === generatedChar){
                    console.log('went to true')
                    setIsCorrect(()=>true)
                    setLastKeyPressIsCorrect(()=>true)
                    setGeneratedChar(()=>possible_chars[Math.floor(Math.random() * possible_chars.length)])
                    setNumberCorrectKeyPresses((numberCorrectKeyPresses)=>numberCorrectKeyPresses+=1)
                    
                }
                else{
                    console.log('went to false')
                    setIsCorrect(()=>false)
                    setLastKeyPressIsCorrect(()=>false)
                }
                
                clearTimeout(finger_reset_timeout_idRef.current)
                // reset timer on keypress
                finger_reset_timeout_idRef.current = setTimeout(() => {
                    setLastPosition((last_position)=>{
                    return {
                        ...last_position, ...{[assigned_finger_v] :original_positions[[assigned_finger_v]]}
                    }
                    })
                    }, 3000);

            }

        }

    }


    const handleKeyUp= (event)=>{

        if(event.code ==='ShiftLeft' || event.code === 'ShiftRight'){
            setKeySet(window.iso_qwerty.rows)
        }

        if(event.key === props.keychar || event.code === props.keychar){
            //console.log('event up localy recognized with key = ', props.keychar)
            setIsDown((isDown) => false)
        }

        
    }

    // either dont get a dependency array at all and new event listeners will be attached everytime
    // or add handleKeyUp as a dependency so it will attach the new handler to the listener
    useEffect(()=>{
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return ()=>{
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }

    })

    return (

        //avoided nested ternary operator, might need to do it anyway so special keys dont get correct/incorrect classes
        <div className={"key"+ (isDown? " active" + (isCorrect? " correct" : " incorrect") : "") + (special_keys.includes(props.keychar)? " special-key-"+props.keychar : "")} id={props.keychar}>
            {(special_keys.includes(props.keychar)
            ? <div className="special-key-wrapper"> <img src={special_keys_icons[props.keychar]}/> </div>
            : <p>{props.keychar}</p>) }

            {(props.keychar === 'f' || props.keychar === 'F' || props.keychar === 'j' || props.keychar === 'J')
            
            ? <p>_</p>
            : <></>
            } 

        </div>
    );
}

export default Key