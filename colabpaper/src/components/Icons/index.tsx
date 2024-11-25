import { ReactElement, ReactNode, SVGProps } from 'react'
import * as SVGIcons from './SVG'
import { ExtendSVGProps } from './SVG'

export type SVGNames = 'Memory' | 'Explore' | 'Home' | 'Search' | 'World' | 'Shared' | 'Private' | 'Account' | 'Hamburger' | 'Play' | 'Pause' | 'FullScreen' | 'MinScreen' | 'Settings' | 'Eye' | 'HideEye' | 'Check' | 'AddImage' | 'AnimatedCheckmark' | 'Add'

const NameToSVGMap = new Map<SVGNames, (props: ExtendSVGProps) => JSX.Element>([
    ['Memory', SVGIcons.MemorySVG],
    ['Explore', SVGIcons.ExploreSVG],
    ['Home', SVGIcons.HomeSVG],
    ['Search', SVGIcons.SearchSVG],
    ['World', SVGIcons.WorldSVG],
    ['Shared', SVGIcons.SharedSVG],
    ['Private', SVGIcons.PrivateSVG],
    ['Account', SVGIcons.AccountSVG],
    ['Hamburger', SVGIcons.HamburgerSVG],
    ['Play', SVGIcons.PlaySVG],
    ['Pause', SVGIcons.PauseSVG],
    ['FullScreen', SVGIcons.FullScreenSVG],
    ['MinScreen', SVGIcons.MinScreenSVG],
    ['Settings', SVGIcons.SettingsSVG],
    ['Eye', SVGIcons.EyeSVG],
    ['HideEye', SVGIcons.HideEyeSVG],
    ['Check', SVGIcons.CheckSVG],
    ['AddImage', SVGIcons.AddImageSVG],
    ['AnimatedCheckmark', SVGIcons.AnimatedCheckmark],
    ['Add', SVGIcons.AddSVG]
])

export const getSVGFromName = (svgName: SVGNames, svgProps?: ExtendSVGProps) => {
    const SVGComponent = NameToSVGMap.get(svgName)
    if (SVGComponent) {
        return <SVGComponent {...svgProps} />
    }
    return null
}

export { SVGIcons, type ExtendSVGProps }