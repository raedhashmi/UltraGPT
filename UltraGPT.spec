# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['E:\PythonStuff\\UltraGPT\\UltraGPT.py'],
    pathex=[],
    binaries=[],
    datas=[('E:\PythonStuff\\UltraGPT\\templates', 'templates/')],
    hiddenimports=[
        'langchain.chains.conversation', 
        'langchain.chains.conversation.base',
        'generate',
        'set_google_api_key',
        'set_openai_api_key',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='UltraGPT',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['E:\PythonStuff\\UltraGPT\\templates\\favicon.ico'],
)
