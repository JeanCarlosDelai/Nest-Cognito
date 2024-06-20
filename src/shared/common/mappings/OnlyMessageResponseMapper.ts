import { OnlyMessageResponseDto } from '../dtos/onlyMessageResponse.dto';

export default class OnlyMessageResponseMapper {
  static response = (message: string): OnlyMessageResponseDto => {
    return new OnlyMessageResponseDto(message);
  };
}
