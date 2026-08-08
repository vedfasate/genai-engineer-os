import { Select } from '@/shared/ui/Select'
import { CHAT_MODELS } from '@/features/chat/registry/models'

interface ModelSelectorProps {
    value: string
    onChange: (modelId: string) => void
}

const MODEL_OPTIONS = CHAT_MODELS.map((model) => ({
    value: model.id,
    label: `${model.provider} ${model.label} - ${model.capability}`,
}))

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
    return (
        <Select
            options={MODEL_OPTIONS}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full sm:w-80"
        />
    )
}
