import { app, BrowserWindow, Menu, type MenuItemConstructorOptions } from 'electron'
import { APP_NAME } from '../shared/appInfo'
import { IPC } from '../shared/ipc'
import { tr } from './lang'

/** Ber vinduet åpne innstillingssiden. */
function openSettings(): void {
  BrowserWindow.getFocusedWindow()?.webContents.send(IPC.openSettings)
}

/** Programmenyen, på språket brukeren har valgt. Bygges på nytt når språket endres. */
export function buildMenu(): void {
  const isMac = process.platform === 'darwin'
  const settingsItem: MenuItemConstructorOptions = {
    label: tr('Innstillinger …', 'Settings …'),
    accelerator: 'CmdOrCtrl+,',
    click: openSettings
  }
  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: APP_NAME,
            submenu: [
              { role: 'about', label: tr(`Om ${APP_NAME}`, `About ${APP_NAME}`) },
              { type: 'separator' },
              settingsItem,
              { type: 'separator' },
              { role: 'hide', label: tr(`Skjul ${APP_NAME}`, `Hide ${APP_NAME}`) },
              { role: 'hideOthers', label: tr('Skjul andre', 'Hide Others') },
              { role: 'unhide', label: tr('Vis alle', 'Show All') },
              { type: 'separator' },
              { role: 'quit', label: tr(`Avslutt ${APP_NAME}`, `Quit ${APP_NAME}`) }
            ]
          } satisfies MenuItemConstructorOptions
        ]
      : []),
    {
      label: tr('Rediger', 'Edit'),
      submenu: [
        { role: 'undo', label: tr('Angre', 'Undo') },
        { role: 'redo', label: tr('Gjør om', 'Redo') },
        { type: 'separator' },
        { role: 'cut', label: tr('Klipp ut', 'Cut') },
        { role: 'copy', label: tr('Kopier', 'Copy') },
        { role: 'paste', label: tr('Lim inn', 'Paste') },
        { role: 'selectAll', label: tr('Merk alt', 'Select All') },
        ...(isMac ? [] : ([{ type: 'separator' }, settingsItem] satisfies MenuItemConstructorOptions[]))
      ]
    },
    {
      label: tr('Vis', 'View'),
      submenu: [
        { role: 'togglefullscreen', label: tr('Fullskjerm', 'Full Screen') },
        ...(app.isPackaged
          ? []
          : ([
              { type: 'separator' },
              { role: 'reload', label: tr('Last inn på nytt', 'Reload') },
              { role: 'toggleDevTools', label: tr('Utviklerverktøy', 'Developer Tools') }
            ] satisfies MenuItemConstructorOptions[]))
      ]
    },
    {
      label: tr('Vindu', 'Window'),
      submenu: [
        { role: 'minimize', label: tr('Minimer', 'Minimize') },
        { role: 'zoom', label: 'Zoom' },
        ...(isMac ? [] : ([{ role: 'quit', label: tr('Avslutt', 'Quit') }] satisfies MenuItemConstructorOptions[]))
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
