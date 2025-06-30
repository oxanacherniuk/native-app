import * as React from "react"
import Svg, { Path } from "react-native-svg"
const LibraryIcon = () => (
    <Svg
        width={18}
        height={22}
        fill="none"
    >
        <Path
        stroke="#AFB2BF"
        strokeWidth={1.5}
        d="M1 7c0-2.828 0-4.243.879-5.121C2.757 1 4.172 1 7 1h4c2.828 0 4.243 0 5.121.879C17 2.757 17 4.172 17 7v8c0 2.828 0 4.243-.879 5.121C15.243 21 13.828 21 11 21H7c-2.828 0-4.243 0-5.121-.879C1 19.243 1 17.828 1 15V7Z"
        />
        <Path
        stroke="#AFB2BF"
        strokeWidth={1.5}
        d="M16.898 15h-12c-.93 0-1.395 0-1.777.102A3 3 0 0 0 1 17.224"
        />
        <Path
        stroke="#AFB2BF"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M5 6h8M5 9.5h5"
        />
    </Svg>
)
export default LibraryIcon