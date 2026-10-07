import 'server-only'
import sanitizeHtml from 'sanitize-html'

// Editor output is stored as HTML; strip anything the editor can't produce (scripts, event handlers, iframes…).
export function cleanContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'code', 'pre',
      'blockquote', 'ul', 'ol', 'li', 'hr', 'a', 'img',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
      p: ['style'],
      h2: ['style'],
      h3: ['style'],
      h4: ['style'],
    },
    allowedStyles: { '*': { 'text-align': [/^(left|right|center|justify)$/] } },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: [] },
    // Images may only point at files uploaded to this site.
    exclusiveFilter: (frame) => frame.tag === 'img' && !/^\/files\/[A-Za-z0-9-]+$/.test(frame.attribs.src ?? ''),
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
    },
  })
}

// Ids of uploaded images referenced inside the post body.
export function inlineFileIds(html: string) {
  return [...html.matchAll(/\/files\/([A-Za-z0-9-]+)/g)].map((m) => m[1])
}
