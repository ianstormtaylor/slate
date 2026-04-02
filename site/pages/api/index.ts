import { EXAMPLE_NAMES_AND_PATHS } from '../../constants/examples'

export function getAllExamples() {
  return EXAMPLE_NAMES_AND_PATHS.map(([, path]) => path)
}
