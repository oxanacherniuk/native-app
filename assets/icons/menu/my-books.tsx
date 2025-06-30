import Svg, { Path } from "react-native-svg"
const MyBooksIcon = () => (
    <Svg
        width={20}
        height={18}
        fill="none"
    >
        <Path
        fill="#AFB2BF"
        fillRule="evenodd"
        d="M8 0c.667 0 1.333.253 2 .76.667-.507 1.333-.76 2-.76h6a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-7c0 .552-.45 1-1 1s-1-.45-1-1H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h6Zm0 2H2v13h7V3c0-.55-.45-1-1-1Zm10 0h-6c-.55 0-1 .45-1 1v12h7V2Z"
        clipRule="evenodd"
        />
    </Svg>
)
export default MyBooksIcon