export const lexicalToPlainText = (value: unknown): string => {
  const children = (value as any)?.root?.children
  if (!Array.isArray(children)) return ''

  return children
    .map((node: any) =>
      Array.isArray(node.children)
        ? node.children.map((child: any) => child.text ?? '').join('')
        : '',
    )
    .join('\n')
}

export const plainTextToLexical = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: text.split('\n').map((line) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      direction: null,
      version: 1,
      children: [
        {
          type: 'text',
          text: line,
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          version: 1,
        },
      ],
    })),
  },
})
