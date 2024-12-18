import * as React from "react"
import { SVGProps } from "react"

export interface ExtendSVGProps extends SVGProps<SVGSVGElement> {
    fillcolor?: string;
}

const SettingsSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 100 100"
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            d="m42 960.362-1.906 10.5a32.95 32.95 0 0 0-5.344 2.219l-8.813-6.063-11.312 11.313 6.094 8.781a32.735 32.735 0 0 0-2.219 5.344L8 994.362v16l10.5 1.906c.586 1.864 1.359 3.64 2.25 5.344l-6.125 8.781 11.313 11.313 8.78-6.063a32.97 32.97 0 0 0 5.376 2.22l1.906 10.5h16l1.906-10.5a32.757 32.757 0 0 0 5.344-2.22l8.781 6.063 11.313-11.313-6.094-8.78a32.72 32.72 0 0 0 2.219-5.313L92 1010.362v-16l-10.531-1.906a32.735 32.735 0 0 0-2.188-5.313l6.063-8.812-11.313-11.313-8.781 6.063a32.753 32.753 0 0 0-5.344-2.219L58 960.362H42zm8 24c9.941 0 18 8.059 18 18s-8.059 18-18 18-18-8.059-18-18 8.059-18 18-18z"
            overflow="visible"
            transform="translate(0 -952.362)"
        />
    </svg>
)

const MinScreenSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 100 100"
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            d="M80.769 40.769H62.308a3.077 3.077 0 0 1-3.077-3.077v-18.46h6.153v15.384h15.384v6.153h.001zM19.231 59.231h18.461a3.077 3.077 0 0 1 3.077 3.077v18.461h-6.153V65.384H19.231v-6.153zm61.538 6.153H65.384v15.384h-6.153V62.307a3.077 3.077 0 0 1 3.077-3.077h18.461v6.154zM19.231 34.616h15.384V19.232h6.153v18.461a3.077 3.077 0 0 1-3.077 3.077h-18.46v-6.154z"
        />
    </svg>
)

const FullScreenSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        style={{
            fillRule: "evenodd",
            clipRule: "evenodd"
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 100 100"
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            d="M62.3 16.175h18.45a3.075 3.075 0 0 1 3.075 3.075V37.7h-6.15V26.673L64.474 39.874l-4.348-4.348 13.201-13.201H62.3v-6.15zm-22.426 48.3-13.201 13.2H37.7v6.15H19.25a3.075 3.075 0 0 1-3.075-3.075V62.3h6.15v11.027l13.201-13.201 4.348 4.349zm-13.201-42.15 13.201 13.201-4.348 4.348-13.201-13.201V37.7h-6.15V19.25a3.075 3.075 0 0 1 3.075-3.075H37.7v6.15H26.673zm37.801 37.801 13.201 13.201V62.3h6.15v18.45a3.075 3.075 0 0 1-3.075 3.075H62.3v-6.15h11.027L60.126 64.474l4.348-4.348z"
        />
    </svg>
)

const PauseSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 100 100"
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            d="M25.496 22.352a1.809 1.809 0 0 0-1.8 1.8v51.696a1.809 1.809 0 0 0 1.8 1.8h15.645a1.809 1.809 0 0 0 1.8-1.8V24.153a1.809 1.809 0 0 0-1.8-1.801zM58.859 22.352a1.809 1.809 0 0 0-1.8 1.8v51.696a1.809 1.809 0 0 0 1.8 1.8h15.645a1.809 1.809 0 0 0 1.8-1.8V24.153a1.809 1.809 0 0 0-1.8-1.801z"
        />
    </svg>
)

const PlaySVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 100 100"
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            d="m28.991 23.033.519.031.513.217 42 25c1.303.776 1.303 2.662 0 3.438l-42 24.999C28.69 77.512 27 76.551 27 75V25c.056-.89.566-1.692 1.481-1.933l.51-.034z"
        />
    </svg>
)

const AccountSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 18.999 19"
        {...props}
    >
        <clipPath id="a">
            <path d="M0 0h18.999v19H0z" />
        </clipPath>
        <g clipPath="url(#a)">
            <path
                fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
                d="M9.5 0a9.487 9.487 0 0 0-6.38 16.52.426.426 0 0 0 .12.11c.01.01.03.02.04.03a9.434 9.434 0 0 0 12.438 0c.01-.01.03-.02.04-.03a.427.427 0 0 0 .12-.11A9.487 9.487 0 0 0 9.5 0Zm0 3.05a4.075 4.075 0 1 1-4.08 4.08A4.084 4.084 0 0 1 9.5 3.05ZM9.5 18a8.5 8.5 0 0 1-5.42-1.95c-.27-.23-.53-.48-.78-.74.54-1.07 2.04-2.77 6.2-2.77s5.66 1.7 6.2 2.77c-.25.26-.51.51-.78.74A8.5 8.5 0 0 1 9.5 18Z"
            />
        </g>
    </svg>
)

const HamburgerSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 52.004 23"
        {...props}
    >
        <g
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
        >
            <path d="M1.5 3h49.004a1.5 1.5 0 1 0 0-3H1.5a1.5 1.5 0 1 0 0 3ZM50.504 10.05H1.5a1.5 1.5 0 1 0 0 3h49.004a1.5 1.5 0 1 0 0-3ZM50.504 20H1.5a1.5 1.5 0 1 0 0 3h49.004a1.5 1.5 0 1 0 0-3Z" />
        </g>
    </svg>
)

const PrivateSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 48.496 57.892"
        {...props}
    >
        <g
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
        >
            <path d="M24.755.01c7.78.276 13.867 6.808 13.59 14.593-.282 7.781-6.813 13.867-14.598 13.586-7.782-.277-13.863-6.808-13.586-14.594C10.438 5.814 16.969-.268 24.755.01M0 56.29c0 .398.102.8.4 1.102.198.3.6.5 1 .5h45.698c.398 0 .8-.2 1-.5.3-.301.398-.7.398-1.102-.3-2.602-.8-5-1.699-7.3-.101-.102-.101-.2-.101-.302-2.5-6.601-7.301-11.699-13.102-14.398-.102 0-.102 0-.102-.101-2.898-1.3-5.898-2-9.199-2C11.801 32.291 1.301 42.689 0 56.291Z" />
        </g>
    </svg>
)

const SharedSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 80.001 68.801"
        {...props}
    >
        <g
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
        >
            <path d="M24.755 10.918c7.78.277 13.867 6.809 13.59 14.594-.282 7.781-6.813 13.867-14.598 13.586-7.782-.277-13.863-6.809-13.586-14.594.277-7.781 6.808-13.863 14.594-13.586M55.802 0C48 0 41.7 6.3 41.7 14.102c0 7.801 6.3 14.102 14.102 14.102 7.8 0 14.102-6.3 14.102-14.102C69.9 6.297 63.603 0 55.802 0ZM78.603 57.898c.398 0 .699-.2 1-.398.3-.301.398-.7.398-1.102-1.3-13.602-11.699-24-24.199-24-7.898 0-15.102 4.2-19.699 11.102 5.7 3 10.2 8.102 12.801 14.398h29.699ZM0 67.199c0 .398.102.8.4 1.102.198.3.6.5 1 .5h45.698c.398 0 .8-.2 1-.5.3-.301.398-.7.398-1.102-.3-2.602-.8-5-1.699-7.3-.101-.102-.101-.2-.101-.302-2.5-6.601-7.301-11.699-13.102-14.398-.102 0-.102 0-.102-.101-2.898-1.3-5.898-2-9.199-2C11.801 43.199 1.301 53.598 0 67.2v-.001Z" />
        </g>
    </svg>
)

const WorldSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 88.928 88.928"
        {...props}
    >
        <g
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
        >
            <path d="M21.206 47.956c0-.229-.391-.418-.868-.418s-1.204-.271-1.616-.599c-.412-.332-.965-.332-1.229 0-.262.328-.154.599.24.599s.947.188 1.227.418c.281.23.9.42 1.378.42.478 0 .868-.189.868-.42ZM24.259 48.795c-.295-.231-.592-.581-.658-.778l-.599.359-.599.358c-.658.286-1.736.985-2.395 1.556h4.25a.54.54 0 0 0 .54-.538c0-.296-.242-.727-.539-.957ZM38.976 6.598c.285.012.453.052.191-.012a.285.285 0 0 0-.191.012ZM50.902 29.425v.031c-.376.56-.683 1.287-.683 1.617 0 .329.06.773.133.988.073.213.469.091.881-.271.41-.361.881-.74 1.046-.838.165-.1.3-.504.3-.898v-.24c0-.239-.42-.838-.539-1.076-.12-.24-.477-.719-.508-1.078l-.031-.358c-.23-.496-.66-.899-.953-.899h-.063c-.063 0-.122.659-.242.838l-.119.181c.199.593.549 1.48.778 1.975v.028ZM48.507 30.834l.3-.062c.296-.164.646-.689.778-1.166.132-.479.213-1.139.18-1.467l-.419.239c-.419.238-.839.359-.839.719 0 .359-.299 1.796 0 1.737ZM72.696 62.566c-.891 1.159-1.742 2.229-1.893 2.372-.152.143-.621.827-1.042 1.52l-.12.239-.119.239c.328.46.689.838.802.838.11 0 .343.027.515.06l.12-.06c.119-.061.239-.119.359-.42.119-.298.239-.359.3-.837.059-.479.897-1.858.958-2.097l.06-.239c.296-.987.755-2.417 1.018-3.173l-.479.779-.479.779Z" />
            <path d="M44.464 0C19.946 0 0 19.946 0 44.464c0 24.517 19.946 44.464 44.464 44.464 24.518 0 44.464-19.947 44.464-44.464C88.928 19.946 68.982 0 44.464 0Zm26.195 49.372c-.131.507-.724.326-1.316-.397l-.359-.599c-.359-.599-1.438-1.677-1.916-2.036l-.479-.359c-.066-1.449-.277-2.635-.471-2.635h.802c.411 0 1.017.378 1.345.838l.239.783c.24.783 1.677 2.092 1.917 3.249l.238 1.156ZM58.454 38.65c.201-.277.578-.505.838-.505s.902.146 1.429.326c.528.179.931.001.898-.395-.033-.396.129-.718.359-.718.23 0 .797.335 1.257.743.461.409 1.512.743 2.335.743s1.336.519 1.138 1.148l-.239.443-.239.444c-.856.236-2.042.431-2.635.431s-1.32-.028-1.616-.062c-.296-.032-.835.129-1.198.358-.361.231-.951.285-1.309.122-.358-.166-1.358-.893-2.223-1.617l-.12-.359c-.12-.359-1.916-.598-2.274-.719l-.36-.119c-1.118.065-2.305.335-2.634.599l-1.078.239c-1.078.239 1.078-1.437 1.678-1.609.598-.172.838-1.265 1.196-2.104l.359-.837c.855.461 1.772.837 2.036.837.263 0 .964.323 1.557.719l.358.599c.359.599-.239.359-.479.786l-.238.427c.459.323 1.002.359 1.204.08Zm5.74-4.165.358-.423.359-.424c.396.233.866.062 1.048-.383.181-.443.626-.267.987.393l.12.359.119.358c.725.329 1.156.757.959.953-.198.195-.791.355-1.318.353-.526-.002-1.146 0-1.377.004-.231.004-1.537-.192-1.735-.418-.197-.228.02-.573.48-.772Zm5.709-18.861c-.343.32-.646.454-.815.312-.215-.181-.619-.915-1.04-1.854a38.656 38.656 0 0 1 1.855 1.542Zm-29.921 5.708.024-.019.196-.147-.162.126c.072-.056.101-.08-.034.021a1.417 1.417 0 0 0-.082.07c.012-.009.024-.02.036-.028-.021.018-.035.028-.039.031.002 0 .002-.002.003-.003l-.071.056c.025-.023.104-.086.129-.107ZM6.029 46.227c.064.038.09.06-.005-.108-.023-.55-.037-1.1-.037-1.654v-.043c.235.616.51 1.298.73 1.799l.358.239c.358.24.575.455.839.721l.119.479c.121.478-.6.599 0 .957.6.359-.238-.358.6.359s1.316.598 1.676.838c.359.239.479-.719.838 0 .359.718-.719 0 .359.718l1.078.718c.329.197.652.036.719-.359l.717.719.72.72c.462.065.892.281.958.479l.599.479c.599.479 0-.241.599.479.598.719.841.88 1.138 1.077.296.198.646.359.778.359.131 0 .32.134.419.299.099.164.396.569.659.897.262.329.479.788.479 1.02 0 .229-.27.041-.599-.421v.838c0 .839.12.12 0 .839s.042.935.239 1.198c.197.262.359.668.359.896v.839c0 .231.323.797.719 1.257l.359.24c.358.24-.6-.6.358.24a82.134 82.134 0 0 1 1.616 1.436c.362.33.658.706.658.839s.377-.028.84-.359l.358.6.359.599c.264.328.479.707.479.839 0 .13.215-.192.479-.72l.239.959.239.957c-.131.264.084.749.479 1.077l.12.359c.12.358-.239.718 0 1.077l.239.358c.198.858.575 1.988.839 2.518.264.525.371 1.28.239 1.676l.24.359.239.357c.198.396-.019 1.042-.479 1.438l.839.838c.837.839.358 0 .837.839l.479.838c.053.119.125.262.212.413C17.1 75.457 6.747 62.076 6.029 46.227ZM44.464 82.94c-3.401 0-6.7-.444-9.843-1.276-.062-.339-.068-.646-.004-.837l-.359-.36c-.358-.359-.44-.494-.538-.658-.1-.165-.18-.487-.18-.719 0-.23.215-.688.479-1.019l-.479-.239c-.479-.239-.479.479-.479-.239s.27-.934.599-1.196l.24-.359c.238-.359-.12.479.238-.359l.359-.838c.133-.593.429-1.24.659-1.437.23-.199.419-.521.419-.719v-.778c0-.231-.055-.582-.119-.779l.119-.479.12-.479c-.066-.396.042-.827.239-.957l.359-.239.359-.24c.526-.462.688-.999.359-1.196l.598-.359c.6-.36.958-.719.839-1.198-.12-.479.119.719-.12-.479-.239-1.199-.359-1.079-.359-1.917 0-.838-.479-.12 0-.838l.479-.718c.395-.758.342-1.781-.12-2.275l-.359-.12c-.359-.119-.719-.359-1.316-.599l-.599-.239a56.99 56.99 0 0 1-2.515-.959l-.359-.119-.359-.119c-.659-.922-1.252-1.677-1.316-1.677l-1.078-.359c-1.078-.358-1.317-.478-1.677-.837l-.359-.359c-.526-.463-1.012-.975-1.077-1.139-.066-.164-.281-.138-.479.061l-1.077-.12-1.078-.121c-.527-.459-1.228-.837-1.557-.837l-.479.239-.479.239c-.462.33-1.027.652-1.259.718-.23.065-.769.095-1.196.061-.429-.034-1.021-.194-1.318-.358-.296-.165-.673-.596-.838-.957a7.017 7.017 0 0 1-.419-1.26l-.358-.239-.36-.238c-.526-.396-.851-1.042-.718-1.437.131-.396.023-.989-.239-1.316l-.479.239-.479.238c-.396.461-.881.946-1.078 1.078l-.359-.12a3.868 3.868 0 0 1-1.557-.958c-.6-.598-.719-1.196-.719-1.557v-.359c.396-.855 1.177-1.881 1.737-2.276.56-.395 1.287-.717 1.616-.717.33 0 .895-.135 1.258-.3.361-.164.955.078 1.316.539.361.462.9 1.136 1.197 1.497.296.362 1.132.281 1.856-.18l-.3-.359-.299-.359c-.264-.396-.211-1.15.12-1.677l.179-.359c.18-.357.42-.478.898-1.196l.958-1.438.239-.359c.526-.922 1.174-1.838 1.437-2.036a5.76 5.76 0 0 0 .897-.897c.231-.296.555-.674.72-.838.165-.166.515-.299.778-.299s.855-.19 1.316-.421c.461-.229 1.081-.417 1.377-.417.297 0 .324-.271.061-.6-.264-.33-.613-.761-.779-.959-.164-.196.213-.573.839-.837.626-.263 1.892-.91 2.813-1.438l-.119.359-.12.358c-.724.922-1.101 1.839-.838 2.036.263.197.964.468 1.558.601l.238-.361.239-.359c.066-.461.039-1.178-.06-1.596-.098-.418-.18-1.262-.18-1.876v-.599c0-.599-.238-2.154-.6-1.915l-.358.239c-.198-.725-.358-1.695-.358-2.156 0-.46-.297-.568-.659-.24-.362.331-1.089.545-1.616.479l.119-.359.12-.359c.329-.197.303-.602-.06-.896-.363-.298-1.305-.972-2.096-1.497l-.239.358-.239.358a30.926 30.926 0 0 1-.658 1.618c-.166.362-.3.847-.3 1.077 0 .231-.108.688-.239 1.018-.132.329-.563.923-.959 1.317-.395.396-.879 1.041-1.077 1.437-.198.396-.468-.089-.599-1.077v-.717c-.856-.79-1.638-1.761-1.736-2.156-.1-.395.035-1.149.299-1.677v-.358c0-.359.6-1.078 1.078-1.557.479-.479 1.677-1.438 2.035-1.676l.359-.241c.461-.263.785-.021.719.539-.066.56.23.964.658.898.428-.067.725-.36.659-.659-.065-.296.177-.699.538-.898.362-.196.82-.788 1.018-1.316a83.72 83.72 0 0 1 1.078-2.635l.359.24.359.239c.461.593.541 1.67.18 2.396-.363.725-.901 1.318-1.197 1.318-.297 0-.62.242-.719.536-.099.298.09.594.419.661l.479.358.479.358c.461.526 1.161.715 1.557.42.396-.297.719-.755.719-1.019 0-.264.242-.478.539-.478.296 0 .7-.352.898-.78.197-.427.305-1.02.238-1.316a5.297 5.297 0 0 1-.119-.899l.119-.479c.12-.479.012-.672-.119-.908-.132-.239-.239-.695-.239-1.019v-1.066c0-.263-.161-.776-.359-1.138-.197-.361-.871-.658-1.497-.658-.625 0-1.973-.404-2.994-.898-.753-.363-1.522-.68-1.979-.82a38.343 38.343 0 0 1 6.323-2.82c.098.379.221.719.356.947.313.525.866 1.011 1.228 1.076l.479-.118c.479-.12 1.438-1.317 1.678-1.677.239-.359 1.914-1.316 2.395-1.556l.217-.108c.301 0 .602-.014.666-.03l.074.019.262.063c-.249-.028-.649.315-.888.766l-.812.608-.957.717c-.264.688-.264 1.658 0 2.154l.359.601.359.599c.065.329.119.705.119.838v.36c0 .358-.119 1.436-.119 1.795 0 .358-.719 2.274-.719 2.634 0 .36-.211 1.33-.468 2.517l-.724.478c-.724.48-.115.839 0 1.438.114.599-.834.479 0 1.197.832.718.474 0 .832.718.359.718.12.239.838 0l.674-.225a166.692 166.692 0 0 0 1.924-2.397c.016-.015.032-.026.055-.044l.016-.015c.006-.003.12-.089.273-.208l.293-.224c1.557-1.199.598-.6 1.557-1.199.957-.599-.24-.239.957-.599l1.197-.358c.791-.395 1.867-1.364 2.396-2.155l.119-.359c.12-.358.359-.358 0-.839-.359-.478-.837.719-.359-.478.479-1.197.261-1.197.549-1.676.29-.48-.528.239 0-1.079l.528-1.318c.198-.328.037-.813-.358-1.076l.718-.479c.719-.479.908-.748 1.139-1.077.229-.33.149-.869-.18-1.196l.599-.359c.485-.292.499.059.678-.315a38.243 38.243 0 0 1 16.032 6.24c.086.252.156.488.078.661l-.216.479c.118.396.959 1.311 1.868 2.034l.543.24.256.111c.388.476.689.888.672.915-.02.028-.083.104-.144.17l-.784.359-.783.358c-.777.396-2.07.937-2.874 1.198l-.119-.478-.12-.479c-.592-.132-1.293-.455-1.557-.719l-.599-.24-.599-.239c-.395-.329-1.203-.76-1.796-.957l-.479.479c-.479.479-1.917.838-2.155 1.677-.24.839-.6 1.676-.719 2.155-.12.48-1.557 2.275-2.036 2.754-.479.479-1.077 1.437-.718 1.916.358.479 1.316 1.678 1.676 1.437.359-.239.737.03 1.197.36.461.328 1.459-.731 2.218-2.354l-.091-.021c-.091-.021-.539-1.696.045-2.056.583-.359.941-2.154 1.301-1.795l.359.358c-.461 1.448-.38 2.827.18 3.062.561.236 1.664.116 2.455-.267l-.599.697c-.6.698-1.677 1.416-1.797 1.775l-.12.359c-1.004 1.12-2.168 2.035-2.588 2.035-.42 0-1.357-.215-2.081-.478l-.839.478-.838.48c-.922.921-1.676 2.055-1.676 2.515 0 .46-.539.515-1.198.119l-.239.719-.239.718c.132.491.348 1.124.479 1.405.132.279.134.714.005.964l-.9.132c-.9.134-1.14-.72-1.379.006l-.24.726c.132.594.216 1.387.188 1.764-.029.378.209-.152.531-1.177l-.119 1.861c-.12 1.864.838.308-.12 1.864s0 .358-.958 1.557c-.959 1.196-.959 1.685-1.677 2.697-.718 1.014-.942 2.092-1.368 2.39-.428.302.067.541 0 1.02l-.068.479c.037.79.469 2.244.958 3.232l.239.359c.239.359.359.719.838 1.318.479.599.965.438 1.557.239l.359.359c.359.359.951.359 1.677.359h.358c.36 0 .6.238.959 0l.359-.239c.525-.198 1.28-.201 1.676-.008.396.194.988.464 1.317.599.329.136.49 1.216.359 2.4l.358.479c.359.479 1.197 1.677 1.557 1.677h.36c.313.263.569.99.569 1.616 0 .626-.128 1.435-.285 1.797-.156.363-.312.819-.345 1.017-.032.198-.167.899-.3 1.558l.24.719c.239.719.371 2.395.784 2.754l.413.359c.131.658.455 1.656.719 2.216.264.56 1.449.694 2.635.299l.718-.241c.718-.238 1.316-.837 1.796-2.034.479-1.197.527-2.514.982-2.874.455-.358 1.053-.957 1.532-1.557.479-.601 1.558-2.036 1.677-2.515l.119-.479c-.197-1.646-.467-3.372-.599-3.833l.479-.479c.479-.479 2.035-2.154 2.275-2.634.238-.479 1.795-2.395 1.915-2.754.12-.359.359-2.036 0-1.796l-.358.238c-.791.396-1.922.02-2.516-.837l.479.118c.479.121 2.395-.277 3.472-1.038l1.078-.757c.791-.921 1.438-2.093 1.438-2.603 0-.509-.27-1.115-.599-1.351l-.358-.118-.361-.121c-.592-.065-1.293-.307-1.556-.537-.263-.23-1.556-1.12-2.874-1.977l.838.121.839.118c1.778.725 4.149 1.372 5.269 1.438l.359-.12c.358-.119 2.395 1.326 2.754 1.621.281.231.932 1.165 1.429 1.874C81.634 66.953 64.882 82.94 44.464 82.94Z" />
        </g>
    </svg>
)

const SearchSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 98.969 99.108"
        {...props}
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            stroke={props.fillcolor ?? 'rgb(6, 251, 253)'}
            strokeLinecap="butt"
            strokeWidth={1}
            d="M93.62 87.35 69.33 63.06A35.44 35.44 0 0 0 77 41C77 21.118 60.882 5 41 5S5 21.118 5 41s16.118 36 36 36a35.44 35.44 0 0 0 22-7.65l24.32 24.3a4.35 4.35 0 0 0 6.3 0 4.35 4.35 0 0 0 0-6.3ZM41 68c-14.912 0-27-12.088-27-27s12.088-27 27-27 27 12.088 27 27c-.038 14.896-12.104 26.962-27 27Z"
        />
    </svg>
)

const MemorySVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 100 100.287"
        {...props}
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            stroke={props.fillcolor ?? 'rgb(6, 251, 253)'}
            strokeLinecap="butt"
            strokeWidth={1}
            d="M6.778 49.878c0 5.172 2.509 9.937 6.598 12.88a14.835 14.835 0 0 0-1.149 5.749c0 7.658 5.803 13.986 13.242 14.818C26.884 89.986 32.813 95 39.887 95c3.86 0 7.354-1.062 10.113-3.035C52.76 93.938 56.253 95 60.113 95c7.074 0 13.003-5.014 14.417-11.675 7.439-.832 13.242-7.16 13.242-14.818 0-1.999-.392-3.942-1.149-5.749a15.867 15.867 0 0 0 6.598-12.88c0-5.51-2.862-10.544-7.386-13.409a14.851 14.851 0 0 0 1.054-5.514c0-7.83-6.069-14.271-13.749-14.865C71.447 9.679 65.602 5 58.726 5A14.953 14.953 0 0 0 50 7.822 14.953 14.953 0 0 0 41.274 5c-6.876 0-12.721 4.679-14.415 11.09-7.68.595-13.749 7.035-13.749 14.865 0 1.911.359 3.773 1.054 5.514a15.893 15.893 0 0 0-7.386 13.409Zm45.431 5.468c.663.021 1.419.035 2.205.035 1.139 0 2.333-.033 3.392-.125.364 1.412.897 2.713 1.602 3.683.432.595 1.105.91 1.789.91a2.209 2.209 0 0 0 1.785-3.508c-1.292-1.777-1.663-6.484-1.084-7.926a2.21 2.21 0 1 0-4.101-1.644c-.409 1.021-.598 2.496-.573 4.105-1.384.099-3.302.098-5.014.047V12.85a9.638 9.638 0 0 1 6.517-2.548c4.45 0 8.229 3.04 9.302 7.196a14.008 14.008 0 0 0-6.778 4.422 2.208 2.208 0 0 0 3.378 2.847 9.595 9.595 0 0 1 6.161-3.344l.002-.001c.207-.025.407-.044.603-.057h.004c.197-.013.389-.019.581-.019 5.298 0 9.609 4.31 9.609 9.608a9.536 9.536 0 0 1-1.012 4.292 14.94 14.94 0 0 0-9.825 1.186 14.97 14.97 0 0 0-4.759-2.899 2.208 2.208 0 1 0-1.554 4.136c3.644 1.369 6.297 4.752 6.758 8.619a2.21 2.21 0 0 0 4.387-.525 14.978 14.978 0 0 0-1.934-5.783 10.562 10.562 0 0 1 7.917.209l.169.077a9.707 9.707 0 0 1 .742.374c.158.088.313.181.465.275.083.053.167.105.249.16.157.104.311.211.461.323.088.066.175.136.261.204a11.243 11.243 0 0 1 .53.446c.143.13.282.264.418.4.068.069.134.141.201.211.109.117.216.236.32.358.049.057.1.113.147.172a11.548 11.548 0 0 1 .878 1.244l.018.031c.125.209.242.422.352.64l.035.067c.114.229.221.463.319.701l.007.018c.1.244.191.493.273.746v.002c.08.247.15.499.212.754l.015.069c.06.25.111.504.152.76v.001a10.874 10.874 0 0 1 .1.902c.019.248.03.498.03.75 0 4.208-2.495 8.012-6.355 9.692l-2.517 1.095 1.607 2.225a9.536 9.536 0 0 1 1.816 5.617c0 4.988-3.82 9.099-8.687 9.564a13.885 13.885 0 0 0-4.795-8.438 13.698 13.698 0 0 0 2.111-5.2 2.21 2.21 0 1 0-4.35-.775c-.667 3.747-3.62 6.789-7.347 7.567a2.209 2.209 0 0 0 .904 4.325 13.756 13.756 0 0 0 5.681-2.667 9.452 9.452 0 0 1 3.561 7.377v.008c-.004 5.199-4.237 9.429-9.436 9.429-3.185 0-5.957-.973-7.904-2.755V55.346h-.001ZM12.11 49.128l.011-.155c.022-.251.05-.5.089-.747v-.001c.041-.256.092-.51.152-.76l.015-.069c.063-.255.132-.507.212-.754v-.002a11.235 11.235 0 0 1 .279-.765 11.037 11.037 0 0 1 .706-1.407l.018-.031a10.404 10.404 0 0 1 .496-.745c.123-.17.25-.336.382-.499.048-.059.098-.115.147-.172.104-.122.21-.241.32-.358.066-.07.133-.142.201-.211a10.508 10.508 0 0 1 .948-.846c.086-.068.173-.138.261-.204.15-.112.304-.22.461-.323.082-.055.166-.107.249-.16.153-.095.308-.188.465-.275.07-.039.14-.076.21-.113.174-.092.351-.179.532-.261.056-.026.113-.053.17-.077a10.503 10.503 0 0 1 4.211-.878c3.357 0 6.233 1.565 8.141 4.354a14.95 14.95 0 0 0-4.892 4.455 2.208 2.208 0 1 0 3.623 2.527c2.227-3.192 6.158-4.925 10.016-4.418a2.209 2.209 0 1 0 .578-4.38 15.025 15.025 0 0 0-5.121.204c-2.682-4.513-7.182-7.161-12.346-7.161-1.106 0-2.184.124-3.222.353a9.536 9.536 0 0 1-1.012-4.292c0-5.299 4.311-9.608 9.609-9.608.383 0 .772.024 1.188.075l2.341.288.134-2.355c.288-5.076 4.501-9.053 9.591-9.053 2.417 0 4.75.92 6.517 2.548v14.83c-1.133.694-2.853.938-4.643.606-2.531-.47-4.542-1.9-5.379-3.83a2.21 2.21 0 0 0-4.053 1.759c1.423 3.279 4.648 5.678 8.626 6.415.822.152 1.633.227 2.419.227 1.064 0 2.083-.14 3.029-.405v54.492c-1.947 1.782-4.72 2.755-7.904 2.755-5.194 0-9.424-4.223-9.435-9.416l.002-.02c0-2.454.924-4.579 2.675-6.146 1.733-1.552 4.134-2.406 6.76-2.406a2.209 2.209 0 1 0 0-4.418c-1.305 0-2.576.159-3.787.458a13.878 13.878 0 0 0-1.305-7.415 2.21 2.21 0 0 0-3.975 1.93 9.489 9.489 0 0 1 .142 7.918 12.67 12.67 0 0 0-.783.643c-2.133 1.909-3.499 4.43-3.964 7.246-4.869-.465-8.688-4.576-8.688-9.564 0-2.03.628-3.973 1.816-5.617l1.607-2.225-2.517-1.095a10.568 10.568 0 0 1-6.355-9.692c.002-.256.013-.506.032-.754Z"
        />
    </svg>
)

const HomeSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        viewBox="0 0 88.898 72.187"
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        {...props}
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            stroke={props.fillcolor ?? 'rgb(6, 251, 253)'}
            strokeWidth={props.strokeWidth ?? 4}
            d="m39.045 5.554-32.25 18.56c-.96.55-1.289 1.769-.738 2.73.55.96 1.77 1.289 2.73.738l3-1.73v32.327c0 5.57 4.531 10.11 10.11 10.11h46.43c5.57 0 10.108-4.532 10.108-10.11V25.855l3 1.73a2.002 2.002 0 0 0 2.739-.73 2 2 0 0 0-.739-2.73L51.205 5.574a11.93 11.93 0 0 0-12.16-.02Zm14.07 58.73h-16v-16.91a2.279 2.279 0 0 1 2.281-2.281h11.43a2.279 2.279 0 0 1 2.282 2.281l-.004 16.91h.011Zm21.32-40.44V58.17a6.113 6.113 0 0 1-6.11 6.11l-11.21.003v-16.91c0-3.46-2.82-6.28-6.282-6.28H39.395a6.292 6.292 0 0 0-6.28 6.28v16.91H21.902a6.113 6.113 0 0 1-6.11-6.109V23.843c0-.102-.019-.191-.03-.281l25.3-14.56a7.953 7.953 0 0 1 8.122.012l25.28 14.54c-.011.109-.03.199-.03.289Z"
        />
    </svg>
)

const ExploreSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 41.666 41.668"
        {...props}
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            d="M25.15 17.563a1.833 1.833 0 0 0-1.04-1.041l-8.606-3.479a1.87 1.87 0 0 0-2.057.4 1.87 1.87 0 0 0-.4 2.057l3.479 8.604v.002c.185.476.564.855 1.04 1.04l8.604 3.479h.002a1.87 1.87 0 0 0 2.057-.4c.54-.54.699-1.354.4-2.057l-3.479-8.605ZM22.505 22.5a2.353 2.353 0 1 1 0-3.332c.45.437.701 1.039.701 1.666s-.252 1.228-.701 1.666ZM35.566 6.104v.002A20.836 20.836 0 0 0 20.836 0 20.838 20.838 0 0 0 0 20.834a20.835 20.835 0 0 0 35.566 14.729 20.83 20.83 0 0 0 0-29.458v-.001ZM32.9 32.897a17.034 17.034 0 0 1-12.048 4.978A17.037 17.037 0 0 1 3.82 20.834 17.045 17.045 0 0 1 20.852 3.793 17.035 17.035 0 0 1 32.9 8.77a17.085 17.085 0 0 1 0 24.125Z"
        />
    </svg>
)

const AddSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 41.666 41.668"
        {...props}
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            d="M70.754 47.168H52.832V29.246a1.89 1.89 0 0 0-1.887-1.887h-1.89c-1.04 0-1.887.844-1.887 1.887v17.922H29.246a1.888 1.888 0 0 0-1.887 1.887v1.89a1.89 1.89 0 0 0 1.887 1.887h17.922v17.926-.004a1.89 1.89 0 0 0 1.887 1.887h1.89a1.89 1.89 0 0 0 1.887-1.887V52.832h17.926-.004a1.89 1.89 0 0 0 1.887-1.887v-1.89a1.89 1.89 0 0 0-1.887-1.887z"
        />
    </svg>
)

const EyeSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            d="M3 12s2.25-5.5 9-5.5 9 5.5 9 5.5-2.25 5.5-9 5.5S3 12 3 12Zm9 3.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
        />
    </svg>
)

const HideEyeSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            fillRule="evenodd"
            d="M4.282 3.918a.5.5 0 0 0-.705.047l-.659.753a.5.5 0 0 0 .047.705l3.22 2.818C3.88 9.852 3 12 3 12s2.25 5.5 9 5.5c1.537 0 2.84-.285 3.938-.726l3.78 3.308a.5.5 0 0 0 .705-.047l.659-.753a.5.5 0 0 0-.047-.705L4.282 3.918ZM13.67 14.79l-4.655-4.073a3.25 3.25 0 0 0 4.655 4.074ZM15.25 12c0 .164-.012.326-.036.484l3.212 2.81C20.278 13.764 21 12 21 12s-2.25-5.5-9-5.5c-1.172 0-2.209.166-3.121.44l2.215 1.938A3.25 3.25 0 0 1 15.25 12Z"
            clipRule="evenodd"
        />
    </svg>
)

const CheckSVG = (props: ExtendSVGProps) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        // fill={props.fillcolor}
        className={props.fillcolor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 100 125"
    >
        <path
            // fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            className="fill-current"
            transform="translate(0 -952.362)"
            d="M70.884 982.338a5 5 0 0 0-3.437 1.531c-9.578 9.598-16.893 17.615-25.782 26.688l-9.468-8a5.001 5.001 0 1 0-6.438 7.656l13 11a5 5 0 0 0 6.75-.281c10.77-10.794 18.437-19.414 29-30a5 5 0 0 0-3.625-8.594z"
        />
    </svg>
)

const AddImageSVG = (props: ExtendSVGProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
            fillRule: "nonzero",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        }}
        width={props.width ?? '100%'}
        height={props.height ?? '100%'}
        viewBox="0 0 24 24"
        className={props.fillcolor}
        {...props}
    >
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            fillRule="evenodd"
            d="M10.236 4.5a1.5 1.5 0 0 0-1.342.83l-.394.788A2.5 2.5 0 0 1 6.264 7.5H5A1.5 1.5 0 0 0 3.5 9v9A1.5 1.5 0 0 0 5 19.5h14a1.5 1.5 0 0 0 1.5-1.5V8.5h1V18a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 18V9A2.5 2.5 0 0 1 5 6.5h1.264a1.5 1.5 0 0 0 1.342-.83L8 4.883A2.5 2.5 0 0 1 10.236 3.5H13v1h-2.764Z"
            clipRule="evenodd"
        />
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            fillRule="evenodd"
            d="M12 9.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM7.5 13a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM21 5h-5V4h5v1Z"
            clipRule="evenodd"
        />
        <path
            fill={props.fillcolor ?? 'rgb(6, 251, 253)'}
            fillRule="evenodd"
            d="M19 2v5h-1V2h1Z"
            clipRule="evenodd"
        />
    </svg>
)

const AnimatedCheckmark = (props: ExtendSVGProps) => (
    <div className="inline-block" style={{ width: props.width, height: props.height ?? props.width }}>
        <svg
            className={`w-full h-full rounded-full block animate-checkmark-fill animate-checkmark-scale`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            style={{ stroke: props.fillcolor, boxShadow: `inset 0px 0px 0px ${props.fillcolor}` }}
        >
            <circle
                className="animate-checkmark-circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
                strokeWidth="2"
                strokeMiterlimit="10"
            />
            <path
                className="animate-checkmark-check"
                fill="none"
                strokeWidth="2"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
        </svg>
    </div>
)

export {
    MemorySVG, ExploreSVG, HomeSVG, SearchSVG, WorldSVG, SharedSVG, PrivateSVG, AccountSVG, HamburgerSVG,
    PlaySVG, PauseSVG, FullScreenSVG, SettingsSVG, MinScreenSVG, EyeSVG, HideEyeSVG, CheckSVG, AddImageSVG,
    AnimatedCheckmark, AddSVG
}