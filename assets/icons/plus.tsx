import Svg, { Path } from "react-native-svg"
const PlusIcon = () => (
    <Svg
        width={15}
        height={15}
        fill="none"
    >
        <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7.5 1v13M1 7.5h13"
        />
    </Svg>
)
export default PlusIcon
