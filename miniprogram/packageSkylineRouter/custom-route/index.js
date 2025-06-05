import CupertinoModal from './cupertino-modal'
import CupertinoModalInside from './cupertino-modal-inside'
import ModalNavigation from './modal-navigation'
import Modal from './modal'
import FadeUpwards from './fade-upwards'
import Upwards from './upwards'
import Zoom from './zoom'
import Cupertino from './cupertino'
import BottomSheet from './bottom-sheet'

let hasInstallRouteBuiler = false
export function installRouteBuilder() {
  if (hasInstallRouteBuiler) return
  wx.router.addRouteBuilder('CupertinoModal', CupertinoModal)
  wx.router.addRouteBuilder('CupertinoModalInside', CupertinoModalInside)
  wx.router.addRouteBuilder('ModalNavigation', ModalNavigation)
  wx.router.addRouteBuilder('Modal', Modal)
  wx.router.addRouteBuilder('FadeUpwards', FadeUpwards)
  wx.router.addRouteBuilder('Upwards', Upwards)
  wx.router.addRouteBuilder('Zoom', Zoom)
  wx.router.addRouteBuilder('Cupertino', Cupertino)
  wx.router.addRouteBuilder('BottomSheet', BottomSheet)

  hasInstallRouteBuiler = true

  console.info('skyline: installRouteBuilder')
}