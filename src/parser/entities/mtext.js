
import * as helpers from '../ParseHelpers'

export default function EntityParser() {}
export const BackgroundFillSetting = {
    Fill: 1,
    Transparent: 3,
    Frame: 16
}

EntityParser.ForEntityName = 'MTEXT';

EntityParser.prototype.parseEntity = function(scanner, curr) {
    var entity = { type: curr.value };
    curr = scanner.next();
    while(curr !== 'EOF') {
        if(curr.code === 0) break;

        switch(curr.code) {
        case 3:
        case 1:
            entity.text ? entity.text += curr.value : entity.text = curr.value;
            break;
        case 10:
            entity.position = helpers.parsePoint(scanner);
            break;
        case 11:
            entity.direction = helpers.parsePoint(scanner);
            break;
        case 40:
            //Note: this is the text height
            entity.height = curr.value;
            break;
        case 41:
            entity.width = curr.value;
            break;
        case 44:
            entity.lineSpacing = curr.value;
            break;
        case 45:
            entity.fillBoxScale = curr.value;
            break
        case 50:
            entity.rotation = curr.value;
            break;
        case 63:
            entity.backgroundFillColor = curr.value;
            break
        case 71:
            entity.attachmentPoint = curr.value;
            break;
        case 72:
            entity.drawingDirection = curr.value;
            break;
        case 90:
            // Documentation here is wrong. This seems to be a weird bit flag
            // 0b1 = Background fill
            // 0b11 = Background is transparent (uses window color)
            // 0b10000 = Frame (uses same color as text)
            // If none of these are set, the property seems to be invalid
            entity.backgroundFillSetting = curr.value;
            break
        case 101:
            helpers.skipEmbeddedObject(scanner);
            break;
        default:
            helpers.checkCommonEntityProperties(entity, curr, scanner);
            break;
        }
        curr = scanner.next();
    }
    return entity;
};
