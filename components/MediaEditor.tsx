import { useRef, useState } from 'react'

type MediaEditorProps = {
  mediaUrl: string
  mediaType: 'Photo' | 'Video'
  onCancel: () => void
  onSave: () => void
  onNext: () => void
}
const musicTracks = [
  {
    id: 'stadium-energy',
    name: 'Stadium Energy',
    artist: 'MHSSF Originals',
    category: 'Football Hype',
    audioUrl: '/music/stadium-energy.wav',
  },
  {
    id: 'victory-lap',
    name: 'Victory Lap',
    artist: 'MHSSF Originals',
    category: 'Celebration',
    audioUrl: '/music/victory-lap.mp3',
  },
  {
    id: 'game-day',
    name: 'Game Day',
    artist: 'MHSSF Originals',
    category: 'Trending',
    audioUrl: '/music/game-day.mp3',
  },
]
  

export default function MediaEditor({
  mediaUrl,
  mediaType,
  onCancel,
  onNext,
}: MediaEditorProps) {
  const [activeTool, setActiveTool] = useState('Edit')
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [grayscale, setGrayscale] = useState(0)
  const [overlayText, setOverlayText] = useState('')
  const [isMusicOpen, setIsMusicOpen] = useState(false)
const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
const [musicSearch, setMusicSearch] = useState('')
const selectedMusicTrack = musicTracks.find(
  track => track.id === selectedTrack

)
  const [textColor, setTextColor] = useState('#ffffff')
const [textSize, setTextSize] = useState(36)
const [zoom, setZoom] = useState(1)
const [imageFit, setImageFit] = useState<'contain' | 'cover'>('contain')
const [cropMode, setCropMode] = useState<'story' | 'square' | 'portrait' | 'landscape'>('story')
const [position, setPosition] = useState({ x: 0, y: 0 })
const audioRef = useRef<HTMLAudioElement | null>(null)
const [isDragging, setIsDragging] = useState(false)
const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })
const [isDraggingText, setIsDraggingText] = useState(false)
const [textDragStart, setTextDragStart] = useState({ x: 0, y: 0 })
const filteredMusicTracks = musicTracks.filter((track) => {
  const search = musicSearch.toLowerCase()

  return (
    track.name.toLowerCase().includes(search) ||
    track.artist.toLowerCase().includes(search) ||
    track.category.toLowerCase().includes(search)
  )
})
const mediaFilter = {
  filter: `
    brightness(${brightness}%)
    contrast(${contrast}%)
    saturate(${saturation}%)
    grayscale(${grayscale}%)
  `,
  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
  cursor: isDragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default',
  transition: isDragging ? 'none' : 'transform 0.1s ease',
}
  function startDragging(
  event: React.PointerEvent<HTMLImageElement>
) {
  

  setIsDragging(true)

  setDragStart({
    x: event.clientX - position.x,
    y: event.clientY - position.y,
  })

  event.currentTarget.setPointerCapture(event.pointerId)
}

function dragMedia(
  event: React.PointerEvent<HTMLImageElement>
) {
if (!isDragging) return

  setPosition({
    x: event.clientX - dragStart.x,
    y: event.clientY - dragStart.y,
  })
}

function stopDragging(
  event: React.PointerEvent<HTMLImageElement>
) {
  setIsDragging(false)

  if (
    event.currentTarget.hasPointerCapture(event.pointerId)
  ) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
}

function resetMediaPosition() {
  setZoom(1)
  setPosition({ x: 0, y: 0 })
  setIsDragging(false)
}

  

  function resetEditor() { 
  setBrightness(100)
  setContrast(100)
  setSaturation(100)
  setGrayscale(0)
  setOverlayText('')
  setZoom(1)
  setPosition({ x: 0, y: 0 })
  setIsDragging(false)
} 

  return (
    <div className="mediaEditorOverlay">
      <div className="mediaEditor">
        <div className="editorTopBar">
          <button
            type="button"
            className="editorCloseButton"
            onClick={onCancel}
            aria-label="Close editor"
          >
            ×
          </button>

          <div className="editorTitle">
            <strong>Edit your {mediaType.toLowerCase()}</strong>
            <span>Add text, filters and adjustments</span>
          </div>

          <button
            type="button"
            className="editorResetButton"
            onClick={resetEditor}
          >
            Reset
          </button>
        </div>

    
        <div className="cropModeButtons">
  <button
    type="button"
    className={cropMode === 'story' ? 'active' : ''}
    onClick={() => setCropMode('story')}
  >
    Story
  </button>

  <button
    type="button"
    className={cropMode === 'square' ? 'active' : ''}
    onClick={() => setCropMode('square')}
  >
    Square
  </button>

  <button
    type="button"
    className={cropMode === 'portrait' ? 'active' : ''}
    onClick={() => setCropMode('portrait')}
  >
    Portrait
  </button>

  <button
    type="button"
    className={cropMode === 'landscape' ? 'active' : ''}
    onClick={() => setCropMode('landscape')}
  >
    Landscape
  </button>
</div>
<div className={`editorPreview crop-${cropMode}`}>
          {mediaType === 'Video' ? (
            <video
              src={mediaUrl}
              controls
              playsInline
              style={{
  ...mediaFilter,
  objectFit: imageFit,
}}
              className="editorMedia"
            />
          ) : (
            <img
  src={mediaUrl}
  alt="Media preview"
  style={{
  ...mediaFilter,
  objectFit: imageFit,
  objectPosition: "center",
  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
  transformOrigin: "center center",
  transition: isDragging ? "none" : "transform 0.2s ease",
  cursor: isDragging ? "grabbing" : "grab",
  touchAction: "none",
}}
  className="editorMedia"
  draggable={false}
  onPointerDown={startDragging}
  onPointerMove={dragMedia}
  onPointerUp={stopDragging}
  onPointerCancel={stopDragging}
  onDoubleClick={resetMediaPosition}
/>
          )}

     {overlayText && (
  <div
    className="editorOverlayText"
    style={{
      color: textColor,
      fontSize: `${textSize}px`,
      transform: `translate(${textPosition.x}px, ${textPosition.y}px)`,
cursor: isDraggingText ? 'grabbing' : 'grab',
touchAction: 'none',
    }}
    onPointerDown={(event) => {
  setIsDraggingText(true)
  event.currentTarget.setPointerCapture(event.pointerId)
  setTextDragStart({
    x: event.clientX - textPosition.x,
    y: event.clientY - textPosition.y,
  })
}}
onPointerMove={(event) => {
  if (!isDraggingText) return

  setTextPosition({
    x: event.clientX - textDragStart.x,
    y: event.clientY - textDragStart.y,
  })
}}

onPointerUp={(event) => {
  setIsDraggingText(false)

  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
}}

onPointerCancel={() => {
  setIsDraggingText(false)
}}
  >
    {overlayText}
  </div>
)}     
  </div>
        <div className="editorControls">
          {activeTool === 'Text' && (
  <div className="editorToolPanel">
    <label htmlFor="overlayText">Text</label>

    <input
      id="overlayText"
      type="text"
      value={overlayText}
      onChange={(event) => setOverlayText(event.target.value)}
      placeholder="Add text, @mentions or #hashtags"
      maxLength={120}
      className="editorTextInput"
    />

    <label htmlFor="textColor">Text Color</label>

    <input
      id="textColor"
      type="color"
      value={textColor}
      onChange={(event) => setTextColor(event.target.value)}
    />

    <label htmlFor="textSize">
      Text Size: {textSize}px
    </label>

    <input
      id="textSize"
      type="range"
      min="20"
      max="72"
      value={textSize}
      onChange={(event) => setTextSize(Number(event.target.value))}
    />
  </div>
)}

          {activeTool === 'Filter' && (
            <div className="editorToolPanel editorFilterButtons">
              <button
                type="button"
                onClick={() => {
                  setBrightness(100)
                  setContrast(100)
                  setSaturation(100)
                  setGrayscale(0)
                }}
              >
                Original
              </button>

              <button
                type="button"
                onClick={() => {
                  setBrightness(108)
                  setContrast(105)
                  setSaturation(120)
                  setGrayscale(0)
                }}
              >
                Vivid
              </button>

              <button
                type="button"
                onClick={() => {
                  setBrightness(105)
                  setContrast(90)
                  setSaturation(85)
                  setGrayscale(0)
                }}
              >
                Soft
              </button>

              <button
                type="button"
                onClick={() => {
                  setBrightness(100)
                  setContrast(115)
                  setSaturation(0)
                  setGrayscale(100)
                }}
              >
                B&amp;W
              </button>
            </div>
          )}

          {activeTool === 'Edit' && (
            <div className="editorToolPanel editorSliders">
              <label>
                Brightness: {brightness}%
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(event) =>
                    setBrightness(Number(event.target.value))
                  }
                />
              </label>

              <label>
                Contrast: {contrast}%
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={(event) =>
                    setContrast(Number(event.target.value))
                  }
                />
              </label>

              <label>
                Color: {saturation}%
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(event) =>
                    setSaturation(Number(event.target.value))
                  }
                />
              </label>
              <label>
  Zoom: {zoom.toFixed(1)}x
  <input
    type="range"
    min="0.3"
    max="3"
    step="0.1"
    value={zoom}
    onChange={(event) =>
      setZoom(Number(event.target.value))
    }
  />
  <div className="editorFitButtons">
  <button
    type="button"
    className={imageFit === "contain" ? "active" : ""}
    onClick={() => {
      setImageFit("contain")
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }}
  >
    Fit
  </button>

  <button
    type="button"
    className={imageFit === "cover" ? "active" : ""}
    onClick={() => {
      setImageFit("cover")
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }}
  >
    Fill
  </button>
</div>
</label>
            </div>
          )}
        </div>

        <div className="editorBottomBar">
          <div className="editorTools">
            {['Audio', 'Text', 'Overlay', 'Filter', 'Edit'].map((tool) => (
              <button
                key={tool}
                type="button"
                className={activeTool === tool ? 'activeEditorTool' : ''}
                onClick={() => {
  setActiveTool(tool)

  if (tool === 'Audio') {
    setIsMusicOpen(true)
  }
}}
              >
                <span>
                  {tool === 'Audio' && '♫'}
                  {tool === 'Text' && 'Aa'}
                  {tool === 'Overlay' && '▣'}
                  {tool === 'Filter' && '◉'}
                  {tool === 'Edit' && '☷'}
                </span>

                {tool}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="editorNextButton"
            onClick={onNext}
          >
            Next →
          </button>
        </div>
      </div>
{isMusicOpen && (
  <div className="musicModalBackdrop">
    <div className="musicModal">
      <div className="musicModalHeader">
        <div>
          <h2>Add music</h2>
          <p>Choose a track for your story</p>
        </div>

        <button
          type="button"
          className="musicCloseButton"
          onClick={() => setIsMusicOpen(false)}
        >
          ×
        </button>
      </div>

      <div className="musicTrackList">
        {musicTracks.map((track) => (
          <button
            key={track.id}
            type="button"
            className={
              selectedTrack === track.id
                ? "musicTrack selectedMusicTrack"
                : "musicTrack"
            }
          onClick={() => {
  setSelectedTrack(track.id)

  if (audioRef.current) {
    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }

  audioRef.current = new Audio(track.audioUrl)
  audioRef.current.play()

  setIsMusicOpen(false)
}}
          >
            <span className="musicTrackIcon">♫</span>

            <span className="musicTrackInformation">
              <strong>{track.name}</strong>
              <small>{track.artist}</small>
            </span>

            <span className="musicTrackAction">
              {selectedTrack === track.id ? "✓" : "Add"}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
)}
      
      
      <style jsx>{`
        .mediaEditorOverlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          background: rgba(5, 9, 16, 0.96);
          overflow-y: auto;
        }

        .mediaEditor {
          width: min(680px, 100%);
          color: white;
        }.editorTopBar {
          display: grid;
          grid-template-columns: 70px 1fr 70px;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .editorCloseButton,
        .editorResetButton {
          border: none;
          color: white;
          cursor: pointer;
        }

        .editorCloseButton {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #292d33;
          font-size: 40px;
          line-height: 1;
        }

        .editorResetButton {
          background: transparent;
          font-size: 15px;
        }

        .editorTitle {
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .editorTitle strong {
          font-size: 20px;
        }

        .editorTitle span {
          margin-top: 4px;
          color: #a9adb5;
          font-size: 14px;
        }

       .editorPreview {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: min(430px, 100%);
aspect-ratio: 9 / 16;
max-height: 85vh;
margin: 0 auto;
overflow: hidden;
background: #000;
border-radius: 24px;
} 
.crop-story {
  width: min(430px, 100%);
  aspect-ratio: 9 / 16;
  max-height: 85vh;
}

.crop-square {
  width: min(520px, 100%);
  aspect-ratio: 1 / 1;
  max-height: 80vh;
}

.crop-portrait {
  width: min(500px, 100%);
  aspect-ratio: 4 / 5;
  max-height: 82vh;
}

.crop-landscape {
  width: min(720px, 100%);
  aspect-ratio: 16 / 9;
  max-height: 72vh;
}
  .cropModeButtons {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 0 auto 16px;
}

.cropModeButtons button {
  border: 1px solid #555;
  background: #242424;
  color: #fff;
  padding: 9px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.2s ease;
}

.cropModeButtons button:hover {
  background: #363636;
}

.cropModeButtons button.active {
  background: #2563eb;
  border-color: #2563eb;
}
    .editorMedia {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
  touch-action: none;
  cursor: grab;
  transition: transform 0.15s ease;
}
.editorFitButtons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.editorFitButtons button {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background: #2a2a2a;
  color: white;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s ease, transform 0.2s ease;
}

.editorFitButtons button:hover {
  background: #3b82f6;
}

.editorFitButtons button:active {
  transform: scale(0.98);
}

.editorFitButtons button.active {
  background: #2563eb;
  border-color: #60a5fa;
}
<div className="editorFitButtons">
  <button
    type="button"
    className={imageFit === "contain" ? "active" : ""}
    onClick={() => {
      setImageFit("contain")
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }}
  >
    Fit
  </button>

  <button
    type="button"
    className={imageFit === "cover" ? "active" : ""}
    onClick={() => {
      setImageFit("cover")
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }}
  >
    Fill
  </button>
</div>
        .editorOverlayText {
          position: absolute;
          top: 50%;
          left: 50%;
          max-width: 85%;
          padding: 8px 14px;
          color: white;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          font-size: clamp(22px, 5vw, 52px);
          font-weight: 800;
          text-align: center;
          transform: translate(-50%, -50%);
          overflow-wrap: anywhere;
        }

        .editorControls {
          margin-top: 16px;
        }

        .editorToolPanel {
          padding: 16px;
          background: #1c2027;
          border-radius: 16px;
        }

        .editorToolPanel input[type='text'] {
          width: 100%;
          margin-top: 8px;
          padding: 12px 14px;
          color: white;
          background: #292d33;
          border: 1px solid #444a54;
          border-radius: 10px;
          outline: none;
        }

        .editorSliders {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .editorSliders label {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 14px;
        }

        .editorFilterButtons {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .editorFilterButtons button {
          padding: 10px 18px;
          color: white;
          background: #30353d;
          border: 1px solid #484e58;
          border-radius: 999px;
          cursor: pointer;
        }

        .editorBottomBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
        }

        .editorTools {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .editorTools button {
          min-width: 82px;
          padding: 12px 14px;
          color: white;
          background: #24282f;
          border: 1px solid transparent;
          border-radius: 16px;
          cursor: pointer;
        }

        .editorTools button span {
          display: block;
          margin-bottom: 5px;
          font-size: 21px;
        }

        .editorTools .activeEditorTool {
          border-color: #6075ff;
          background: #303642;
        }

        .editorNextButton {
          flex-shrink: 0;
          padding: 15px 24px;
          color: white;
          background: #5268ff;
          border: none;
          border-radius: 999px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 700px) {
          .mediaEditorOverlay {
            padding: 12px;
            align-items: flex-start;
          }

          .editorPreview {
            min-height: 420px;
          }

          .editorSliders {
            grid-template-columns: 1fr;
          }

          .editorBottomBar {
            flex-direction: column;
          }

          .editorTools {
            justify-content: center;
           }

          .editorNextButton {
            width: 100%;
          }
        }
      .musicModalBackdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.musicModal {
  width: 420px;
  max-width: 90%;
  background: #1d1f27;
  border-radius: 20px;
  padding: 24px;
}

.musicModalHeader{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
}

.musicCloseButton{
  background:none;
  border:none;
  color:white;
  font-size:30px;
  cursor:pointer;
}

.musicTrack{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:14px;
  margin-bottom:10px;
  border-radius:12px;
  border:none;
  background:#2b2d37;
  color:white;
  cursor:pointer;
}

.musicTrack:hover{
  background:#373b46;
}

.selectedMusicTrack{
  border:2px solid #ff3b30;
}

.musicTrackIcon{
  font-size:22px;
  margin-right:15px;
}

.musicTrackInformation{
  flex:1;
  text-align:left;
}

.musicTrackInformation small{
  color:#999;
  display:block;
}`
      }</style>
    </div>
  )
}