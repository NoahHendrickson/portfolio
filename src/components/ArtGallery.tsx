import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react'
import type { GalleryArt } from '../data/projects'
import IconButton from '../design-system/IconButton'
import { space } from '../design-system/tokens'
import './ArtGallery.css'

const TEXT = 'var(--color-text-primary)'
const MUTED = 'var(--color-text-muted)'

/**
 * The pixel art as a bento of bare squares — no ground, no caption — at three sizes. The pieces'
 * own frames and grounds are the tiles. Opening one shows it large with its name.
 */
export default function ArtGallery({ heading, items }: { heading: string; items: GalleryArt[] }) {
  const [selected, setSelected] = useState<number | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)

  return (
    <section aria-label={heading} className="art-gallery">
      <ul className="art-gallery-grid">
        {items.map((art, index) => (
          <li key={art.src} data-size={art.size}>
            <button
              type="button"
              className="art-gallery-tile"
              aria-label={`Enlarge ${art.title}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                openerRef.current = event.currentTarget
                setSelected(index)
              }}
            >
              <img src={art.src} alt={art.alt} loading={index < 5 ? 'eager' : 'lazy'} decoding="async" />
            </button>
          </li>
        ))}
      </ul>
      {selected !== null && (
        <ArtViewer
          items={items}
          selected={selected}
          onSelect={setSelected}
          onClose={() => {
            setSelected(null)
            openerRef.current?.focus({ preventScroll: true })
          }}
        />
      )}
    </section>
  )
}

function ArtViewer({ items, selected, onSelect, onClose }: {
  items: GalleryArt[]
  selected: number
  onSelect: (index: number) => void
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const art = items[selected]
  const step = (direction: number) => onSelect((selected + direction + items.length) % items.length)
  const close = () => {
    // Close before unmounting so the underlying gallery can receive focus.
    dialogRef.current?.close()
    onClose()
  }

  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="art-gallery-dialog"
      aria-labelledby="art-viewer-title"
      onCancel={(event) => { event.preventDefault(); close() }}
      onClick={(event) => { if (event.target === event.currentTarget) close() }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          step(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: space.md }}>
        <IconButton autoFocus label="Close artwork" icon={<X size={20} />} variant="ghost" onClick={close} />
      </div>
      <img className="art-gallery-enlarged" src={art.src} alt={art.alt} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.md, marginTop: space.lg }}>
        <div aria-live="polite" aria-atomic="true" style={{ minWidth: 0 }}>
          <h2 id="art-viewer-title" style={{ fontSize: '24px', fontWeight: 600, lineHeight: 1.3, margin: 0, color: TEXT }}>{art.title}</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.4, color: MUTED, margin: `${space.xs} 0 0` }}>
            {art.category} · {selected + 1} of {items.length}
          </p>
        </div>
        <div style={{ display: 'flex', gap: space.sm }}>
          <IconButton label="Previous artwork" icon={<ArrowLeft size={20} />} variant="ghost" onClick={() => step(-1)} />
          <IconButton label="Next artwork" icon={<ArrowRight size={20} />} variant="ghost" onClick={() => step(1)} />
        </div>
      </div>
    </dialog>
  )
}
