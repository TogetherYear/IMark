use crate::Extra::Tray;
use tauri::generate_handler;

pub mod Automatic;
pub mod Image;
pub mod Monitor;
pub mod Wallpaper;
pub mod Widget;
pub mod Window;

pub fn Generate() -> impl Fn(tauri::Invoke) {
    generate_handler![
        Widget::SetShadow,
        Image::ConvertImageFormat,
        Image::SaveFileFromBase64,
        Automatic::GetMousePosition,
        Automatic::SetMousePosition,
        Automatic::SetButtonClick,
        Automatic::SetButtonToggle,
        Automatic::SetMouseScroll,
        Automatic::GetColorFromPosition,
        Automatic::GetCurrentPositionColor,
        Automatic::WriteText,
        Automatic::SetKeysToggle,
        Automatic::SetKeysClick,
        Window::GetAllWindows,
        Window::CaptureWindow,
        Window::GetWindowCurrentMonitor,
        Monitor::GetAllMonitors,
        Monitor::GetMonitorFromPoint,
        Monitor::GetCurrentMouseMonitor,
        Monitor::GetPrimaryMonitor,
        Monitor::CaptureMonitor,
        Wallpaper::GetWallpaper,
        Wallpaper::SetWallpaper,
        Tray::SetTrayIcon,
        Tray::SetTrayTooltip,
        Tray::UpdateAutostartFlag,
    ]
}
